import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Dimensions, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import tw from "twrnc";
import Text from "../Shared/Text";

const MainApp = () => {
  const screenWidth = Dimensions.get("window").width;
  const [greeting, setGreeting] = useState("");
  const [fullname, setFullname] = useState("Guest");
  const [location, setLocation] = useState("Fetching location...");
  const [categories, setCategories] = useState([
    "Recommended",
    "Food",
    "Drinks",
    "Snacks",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [items, setItems] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Pagi";
      else if (hour < 18) return "Sore";
      else return "Malam";
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
        const currentUser = auth.currentUser; 
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullname(userData.fullname || "Guest"); 
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
        // Ambil data dari koleksi "Makanan"
        const makananSnapshot = await getDocs(collection(db, "Makanan"));
        const makananItems = makananSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          time: doc.data().cookingTime,
          price: doc.data().price || "Gada Harga",
          image: { uri: doc.data().image },
          stock: doc.data().stock,
          category: doc.data().category || "Food",
        }));
    
        // Ambil data dari koleksi "Minuman"
        const minumanSnapshot = await getDocs(collection(db, "Minuman"));
        const minumanItems = minumanSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          time: doc.data().cookingTime,
          price: doc.data().price || "Gada Harga",
          image: { uri: doc.data().image },
          stock: doc.data().stock,
          category: doc.data().category || "Drinks",
        }));
    
        // Gabungkan data "Makanan" dan "Minuman"
        const allItems = [...makananItems, ...minumanItems];
        setItems(allItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    

    fetchData();

    setGreeting(getGreeting());
    fetchLocation();
    fetchFullname(); 
  }, [selectedCategory]);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "Recommended" || item.category === selectedCategory;
    const matchesSearchQuery = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  return (
    <SafeAreaView style={tw`flex-1 mx-4`}>
      <FlatList
        data={filteredItems} 
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={tw`justify-between mx-1`}
        ListHeaderComponent={
          <>
            <View style={tw`py-2`}>
              <View style={tw`flex-row justify-center items-center mb-4`}>
                <Text style={tw`text-sm text-neutral-900`}>{location}</Text>
              </View>
              <View style={tw`mb-2`}>
                <Text style={tw`text-xl font-bold text-neutral-900`}>
                  {greeting}, {fullname}
                </Text>
              </View>
              <View
                style={tw`flex-row items-center bg-gray-200 p-2 rounded-lg mb-4`}
              >
                <TextInput
                  placeholder="Cari Makan Minum..."
                  placeholderTextColor="darkgray"
                  style={tw`flex-1 px-4`}
                  value={searchQuery} 
                  onChangeText={(text) => setSearchQuery(text)} 
                />
                <Ionicons name="search" size={20} color="gray" />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={tw`px-4 py-2 rounded-lg ${
                      selectedCategory === category
                        ? "bg-[#5CB85C]"
                        : "bg-[#5CB85C] opacity-50"
                    } mr-2`}
                    onPress={() => setSelectedCategory(category)} 
                  >
                    <Text
                      style={tw`${
                        selectedCategory === category
                          ? "text-white"
                          : "text-black opacity-100"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={tw`bg-white rounded-xl shadow-lg mb-4 w-[48%] mt-4 p-2 h-52`}
          >
            <Image source={item.image} style={tw`w-full h-24 rounded-lg`} />
            <Text
              style={tw`mt-2 font-bold text-sm text-ellipsis`}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={tw`text-gray-500 text-xs`}>Stok : {item.stock}</Text>
            <View style={tw`flex-1 justify-between mt-2`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-sm font-bold text-center`}>
                  Rp {item.price}
                </Text>
                <TouchableOpacity
                  style={tw`w-12 bg-[#5CB85C] p-2 rounded-md items-center`}
                  onPress={() =>
                    Alert.alert("Pesanan", `Anda memesan ${item.name}`)
                  }
                >
                  <Ionicons name="cart" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default MainApp;
