import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import tw from 'twrnc';  // Import twrnc for Tailwind styling

const MainApp = () => {
  const flatListRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState("");
  const [totalProfit, setTotalProfit] = useState(0); // State to store total profit

  useEffect(() => {
    const fetchUserFullname = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullname(userData.fullname);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    const fetchTotalProfit = async (uid) => {
      try {
        const profitDocRef = doc(db, "profits", uid); // Adjust this path based on where you store profit data
        const profitDoc = await getDoc(profitDocRef);
        if (profitDoc.exists()) {
          const profitData = profitDoc.data();
          setTotalProfit(profitData.totalProfit); // Assuming the document contains a 'totalProfit' field
        } else {
          console.log("No such document for profit!");
        }
      } catch (error) {
        console.error("Failed to load profit data:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserFullname(user.uid);
        fetchTotalProfit(user.uid); // Fetch the total profit when user is authenticated
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  const carouselData = [
    {
      id: "01",
      image: require("./../assets/card2.png"),
    },
    {
      id: "02",
      image: require("./../assets/card1.png"),
    },
    {
      id: "03",
      image: require("./../assets/card3.png"),
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image
          source={item.image}
          style={tw`h-[500px] mt-[-140px] w-[${screenWidth}px]`}
        />
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => (
      <View key={index} style={tw`flex-row items-center`}>
        {activeIndex === index ? (
          <View style={tw`bg-red-700 h-[10px] w-[10px] rounded-full mx-1.5`} />
        ) : (
          <View style={tw`bg-gray-500 h-[10px] w-[10px] rounded-full mx-1.5`} />
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <StatusBar />
        <View>
          <Image
            source={require("./../assets/homePage/cardhoem.png")}
            style={tw`w-full h-50 mb-15`}
            resizeMode="stretch"
          />
          <View
            style={tw`flex-row items-center justify-between px-5 absolute top-5 left-0 right-0 z-10`}
          >
            <Image
              source={require("./../assets/homePage/Logo-transparan.png")}
              style={tw`h-10 w-10 ml-[-10px] mt-2.5`}
            />
            <Ionicons
              name="information-circle"
              size={24}
              color="white"
              style={tw`mt-3.5`}
              onPress={() => navigation.navigate("faq")}
            />
          </View>

          <View>
            <Text
              style={tw`text-white text-base absolute top-[-180px] left-5 z-10`}
            >
              Halo, {fullname}!
            </Text>
            <Text
              style={tw`text-white text-sm absolute top-[-140px] left-5 z-10`}
            >
              Dashboard Keuntungan Bulan Ini
            </Text>
          </View>
        </View>

        <View style={tw`mt-[-20px]`}>
          <FlatList
            data={carouselData}
            showsHorizontalScrollIndicator={false}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled={true}
            onScroll={handleScroll}
          />
          <View style={tw`flex-row justify-center mt-[-120px]`}>
            {renderDotIndicators()}
          </View>
        </View>

        <Text style={tw`font-bold mx-5 mt-5`}>On Going Program</Text>
        <View style={tw`relative mt-2`}>
          <Image
            source={require("../assets/homePage/cardd.png")}
            style={tw`w-11/12 h-40 ml-auto mr-auto`} 
            resizeMode="stretch" 
          />

          <View style={tw`absolute top-0 left-0 right-0 bottom-0 p-4`}>
            <View style={tw`flex-row items-center justify-between px-5`}>
              <Image
                source={require("../assets/coursesPage/undraw_online_learning.png")}
                style={tw`w-30 h-30`} 
                resizeMode="contain"
              />
              <View style={tw`flex-1 ml-4`}>
                <Text style={tw`text-xl text-white`}>
                  Introduction of Venture Capital
                </Text>
                <Text style={tw`text-white text-xs mt-2`}>4 Modules</Text>
                <View style={tw`mt-2`}>
                  <Text style={tw`text-white text-base`}>Complete 15%</Text>
                  <View style={tw`w-full h-2 bg-gray-300 rounded-full mt-1`}>
                    <View
                      style={tw`h-full bg-black rounded-full`}
                      width="15%"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-between items-center mx-5 mt-5`}>
          <Text style={tw`font-bold `}>Pilih Program</Text>
          <Text
            style={tw`text-[#BB1624] text-sm`}
            onPress={() => {
              navigation.navigate("programList");
            }}
          >
            See All
          </Text>
        </View>
        <View style={tw`flex-row flex-wrap justify-between px-4`}>
          <Pressable
            style={tw`bg-white rounded-lg border border-gray-400 h-[80px] w-[30%] mt-2 shadow-md flex items-center justify-center`}
            onPress={() => navigation.navigate("ads")}
          >
            <Image
              source={require("./../assets/fund.png")}
              style={tw`h-[40px] w-[40px] mb-1`}
            />
            <Text style={tw`text-center text-xs`}>Adsense</Text>
          </Pressable>
          <Pressable
            style={tw`bg-white rounded-lg border border-gray-400 h-[80px] w-[30%] mt-2 shadow-md flex items-center justify-center`}
            onPress={() => navigation.navigate("sosmed")}
          >
            <Image
              source={require("./../assets/Marketing-pana.png")}
              style={tw`h-[40px] w-[40px] mb-1`}
            />
            <Text style={tw`text-center text-xs`}>Sosial Branding</Text>
          </Pressable>
          <Pressable
            style={tw`bg-white rounded-lg border border-gray-400 h-[80px] w-[30%] mt-2 shadow-md flex items-center justify-center`}
            onPress={() => navigation.navigate("Keuangan")}
          >
            <Image
              source={require("./../assets/keu.png")}
              style={tw`h-[40px] w-[40px] mb-1`}
            />
            <Text style={tw`text-center text-xs`}>Laporan Keuangan</Text>
          </Pressable>
          <Pressable
            style={tw`bg-white rounded-lg border border-gray-400 h-[80px] w-[30%] mt-2 shadow-md flex items-center justify-center`}
            onPress={() => navigation.navigate("Mentoring")}
          >
            <Image
              source={require("./../assets/Mentor.png")}
              style={tw`h-[40px] w-[40px] mb-1`}
            />
            <Text style={tw`text-center text-xs`}>Mentoring</Text>
          </Pressable>
          <Pressable
            style={tw`bg-white rounded-lg border border-gray-400 h-[80px] w-[30%] mt-2 shadow-md flex items-center justify-center`}
            onPress={() => navigation.navigate("Funding")}
          >
            <Image
              source={require("./../assets/homePage/investment.png")}
              style={tw`h-[40px] w-[40px] mb-1`}
            />
            <Text style={tw`text-center text-xs`}>Pendanaan Usaha</Text>
          </Pressable>
          <Pressable
            style={tw`bg-white rounded-lg border border-gray-400 h-[80px] w-[30%] mt-2 shadow-md flex items-center justify-center`}
            onPress={() => navigation.navigate("Insurance")}
          >
            <Image
              source={require("./../assets/homePage/accounting.png")}
              style={tw`h-[40px] w-[40px] mb-1`}
            />
            <Text style={tw`text-center text-xs`}>Asuransi Usaha</Text>
          </Pressable>
        </View>

        <View style={tw`flex-row justify-between items-center mx-5 mt-5`}>
          <Text style={tw`font-bold `}>Program Saya</Text>
          <Text
            style={tw`text-[#BB1624] text-sm`}
            onPress={() => {
              navigation.navigate("myCourses");
            }}
          >
            See All
          </Text>
        </View>

        {/* Card untuk Program Saya */}
        <View style={tw`flex-row flex-wrap justify-between px-5 mt-3 mb-10`}>
          <View
            style={tw`bg-white rounded-lg border border-gray-400 h-[90px] w-[30%] mb-4 shadow-md`}
          >
            <Image
              source={require("./../assets/funding.png")}
              style={tw`h-[40px] w-[40px] mx-auto mt-2.5`}
            />
            <Text style={tw`text-center text-xs mt-1`}>Pendanaan Usaha</Text>
          </View>
          <View
            style={tw`bg-white rounded-lg border border-gray-400 h-[90px] w-[30%] mb-4 shadow-md`}
          >
            <Image
              source={require("./../assets/funding.png")}
              style={tw`h-[40px] w-[40px] mx-auto mt-2.5`}
            />
            <Text style={tw`text-center text-xs mt-1`}>Asuransi Usaha</Text>
          </View>
          <View
            style={tw`bg-white rounded-lg border border-gray-400 h-[90px] w-[30%] mb-4 shadow-md`}
          >
            <Image
              source={require("./../assets/funding.png")}
              style={tw`h-[40px] w-[40px] mx-auto mt-2.5`}
            />
            <Text style={tw`text-center text-xs mt-1`}>Layanan Lainnya</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainApp;
