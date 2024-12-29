import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const MainApp = () => {
  const screenWidth = Dimensions.get("window").width;
  const [greeting, setGreeting] = useState("");
  const [fullname, setFullname] = useState("Guest"); 
  const [location, setLocation] = useState("Fetching location...");
  const [categories, setCategories] = useState(["Recommended", "Food", "Drinks", "Snacks"]);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [items, setItems] = useState([
    { id: 1, name: "Avocado Salad", time: "20min", rating: 4.5, price: "$15.00", image: require("../assets/StartPage/sateh.png") },
    { id: 2, name: "Burger", time: "25min", rating: 4.7, price: "$10.00", image: require("../assets/StartPage/sateh.png") },
    { id: 3, name: "Pizza", time: "30min", rating: 4.3, price: "$12.00", image: require("../assets/StartPage/sateh.png") },
  ]);

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

    setGreeting(getGreeting());
    fetchLocation();
    fetchFullname(); // Fetch fullname on component mount
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar />
      <LinearGradient colors={["#5A2E02FF", "#D2D0CFFF"]} style={tw`flex-1`}>
        <View style={tw`px-4 py-2`}>
          {/* Header Section */}
          <View style={tw`flex-row justify-center items-center mb-4`}>
            <Text style={tw`text-sm text-neutral-200`}>{location}</Text>
          </View>

          {/* Greeting Section */}
          <View style={tw`mb-2`}>
            <Text style={tw`text-base font-bold text-neutral-200`}>
              {greeting}, {fullname}
            </Text>
          </View>

          {/* Search Bar */}
          <View style={tw`flex-row items-center bg-gray-200 p-2 rounded-lg mt-2 mb-4`}>
            <TextInput
              placeholder="Cari Makan Minum"
              style={tw`flex-1 px-4`}
            />
            <Ionicons name="search" size={20} color="gray" />
          </View>

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={tw`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? "bg-green-500"
                    : "bg-gray-200"
                } mr-2`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={tw`${
                    selectedCategory === category ? "text-white" : "text-black"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Items Section */}
          {/* <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={tw`flex-row items-center bg-gray-100 p-4 rounded-lg mb-4 mt-4`}
              >
                <Image
                  source={item.image}
                  style={tw`w-20 h-20 rounded-lg mr-4`}
                />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-bold`}>{item.name}</Text>
                  <Text style={tw`text-sm text-gray-500`}>{item.time}</Text>
                  <Text style={tw`text-sm text-gray-500`}>⭐ {item.rating}</Text>
                  <Text style={tw`text-lg font-bold`}>{item.price}</Text>
                </View>
                <TouchableOpacity style={tw`bg-green-500 p-2 rounded-full`}>
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          /> */}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MainApp;
