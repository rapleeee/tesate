import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Dimensions, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import tw from "twrnc";

const MainApp = () => {
  const screenWidth = Dimensions.get("window").width;
  const [greeting, setGreeting] = useState("");
  const [fullname, setFullname] = useState("Guest");
  const [location, setLocation] = useState("Fetching location...");
  const [categories, setCategories] = useState(["Recommended", "Food", "Drinks", "Snacks"]);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [items, setItems] = useState([]); // Data produk dari Firebase


  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Selamat Pagi";
      else if (hour < 18) return "Selamat Sore";
      else return "Selamat Malam";
    };

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Permission denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setLocation(`${address[0].city}, ${address[0].country}`);
      } catch (error) {
        setLocation("Unable to fetch location");
      }
    };

    const fetchFullname = async () => {
      try {
        const currentUser = auth.currentUser; // Get current authenticated user
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullname(userData.fullname || "Guest"); // Update fullname state
          } else {
            console.error("User document not found");
          }
        }
      } catch (error) {
        console.error("Failed to fetch fullname:", error);
      }
    };

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Makanan", ));
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name, // Pastikan sesuai dengan atribut di Firestore
          time: doc.data().cookingTime,
          price: doc.data().price || "Rp 15000", // Pastikan ada default jika atribut kosong
          image: { uri: doc.data().image }, // Harus dalam bentuk URI
          stock: doc.data().stock,
          category: doc.data().category || "Food", // Tambahkan kategori jika perlu
        }));
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    fetchData();

    setGreeting(getGreeting());
    fetchLocation();
    fetchFullname(); // Fetch fullname on component mount
  }, [selectedCategory]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
    <ScrollView>
      <StatusBar />
      <LinearGradient colors={["#5A2E02FF", "#D2D0CFFF"]} style={tw`flex-1`}>
        <View style={tw`px-4 py-2`}>
          <View style={tw`flex-row justify-center items-center mb-4`}>
            <Text style={tw`text-sm text-neutral-200`}>{location}</Text>
          </View>
          <View style={tw`mb-2`}>
            <Text style={tw`text-xl font-bold text-neutral-200`}>
              {greeting}, {fullname}
            </Text>
          </View>
          <View style={tw`flex-row items-center bg-gray-200 p-2 rounded-lg mb-4`}>
            <TextInput
              placeholder="Cari Makan Minum"
              style={tw`flex-1 px-4`}
            />
            <Ionicons name="search" size={20} color="gray" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={tw`px-4 py-2 rounded-lg ${selectedCategory === category
                  ? "bg-green-500"
                  : "bg-gray-200"
                  } mr-2`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={tw`${selectedCategory === category ? "text-white" : "text-black"
                    }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={items.filter((item) => selectedCategory === "Recommended" || item.category === selectedCategory)}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2} // Menampilkan 2 kolom
            columnWrapperStyle={tw`justify-between`} // Menjaga jarak antar kolom
            renderItem={({ item }) => (
              <View
                style={tw`bg-white rounded-xl shadow-lg mb-4 w-[47%] mt-4 p-2`}
              >
                <Image
                  source={item.image}
                  style={tw`w-full h-32 rounded-lg`}
                />
                <Text style={tw`mt-2 font-bold text-lg`}>
                  {item.name}
                </Text>
                <Text style={tw`text-gray-500 text-sm`}>
                 Stok : {item.stock}
                </Text>

                <View style={tw`flex-row justify-between items-center mt-2`}>
                  <Text style={tw`text-sm font-bold text-center`}>
                    Rp {item.price}
                  </Text>
                  <TouchableOpacity
                    style={tw`mt-2 bg-green-500 p-2 rounded-md flex-row justify-center items-center`}
                    onPress={() => Alert.alert("Pesanan", `Anda memesan ${item.name}`)}
                  >
                    <Ionicons name="cart" size={20} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white text-sm font-bold`}>Pesan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

        </View>
      </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainApp;
