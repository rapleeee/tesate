import {
  ImageBackground,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Pressable,
  Modal, // Import Modal here
  TouchableOpacity, // Import TouchableOpacity for buttons
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import tw from "twrnc"; // Import twrnc for Tailwind styling

const MainApp = () => {
  const flatListRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState("");
  const [totalProfit, setTotalProfit] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [course, setCourse] = useState([]); // State for multiple courses
  // Fetch user and streak data on mount

  const CardItem = ({ imageSource, title, label }) => {
    return (
      <View style={tw`bg-white rounded-lg p-4 w-[48%] shadow-md relative mt-4`}>
        {label && (
          <View
            style={tw`absolute top-2 right-2 bg-gray-300 px-2 py-.5 rounded-full`}
          >
            <Text style={tw`text-gray-600 text-xs`}>{label}</Text>
          </View>
        )}
        <Image
          source={imageSource} // Gambar yang dinamis
          style={tw`w-20 h-20 mx-auto`}
          resizeMode="contain"
        />
        <Text style={tw`text-center text-sm mt-3`}>{title}</Text>
      </View>
    );
  };

  // Daftar data untuk Cards
  const cardData = [
    {
      imageSource: require("./../assets/keu.png"),
      title: "Dasar Keuangan Bisnis",
      label: "Soon",
    },
    {
      imageSource: require("./../assets/financial.png"),
      title: "Keuangan Pribadi",
      label: "Soon",
    },
  ];


  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullname(userData.fullname);
          setXp(userData.xp || 0);
          setCoins(userData.coins || 0);

          // Mengambil data kursus yang telah diikuti pengguna dari Firestore
          const userCourses = userData.coursesJoined || [];
          const completedModules = userData.completedModules || {};

          setCourse(
            userCourses.map((courseId) => {
              const progress = completedModules[courseId] || [];
              const moduleProgress = (progress.length / 4) * 100;

              return {
                courseId,
                progress,
                totalModules: 4,
                moduleProgress,
                title:
                  courseId === 1
                    ? "Dasar Keuangan Bisnis"
                    : "Pengenalan Strategi Pengembangan Usaha",
                category:
                  courseId === 1 ? "Keuangan Bisnis" : "Investasi Usaha",
                image:
                  courseId === 1
                    ? require("../assets/keu.png")
                    : require("../assets/financial.png"),
              };
            })
          );
        }
      } catch (error) {
        console.error("Gagal memuat data pengguna:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const claimStreak = async () => {
    if (!user) return;

    const today = new Date().toDateString(); // Current date in string format
    const lastClaimedDate = new Date(lastClaimed).toDateString(); // Last claimed date

    // Check if the streak is claimed on a different day or the first time
    if (lastClaimed !== today) {
      let updatedStreak = streak;
      let updatedXp = xp;
      let updatedCoins = coins;

      if (!lastClaimed || today !== lastClaimedDate) {
        // Check if more than a day has passed since the last claim
        const diffTime = Math.abs(new Date(today) - new Date(lastClaimed));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          // Reset streak if user skips a day
          updatedStreak = 1;
        } else {
          // Otherwise, increment streak
          updatedStreak = streak + 1;
        }

        // Add XP and coins based on the streak (each day adds +10)
        updatedXp += 10 * updatedStreak;
        updatedCoins += 10 * updatedStreak;

        try {
          // Update streak, xp, coins, and last claimed in Firestore
          await updateDoc(doc(db, "users", user.uid), {
            streak: updatedStreak,
            lastClaimed: today,
            xp: updatedXp,
            coins: updatedCoins,
          });

          // Update local state
          setStreak(updatedStreak);
          setLastClaimed(today);
          setXp(updatedXp);
          setCoins(updatedCoins);
          closeModal(); // Close the modal after claiming
        } catch (error) {
          console.error("Failed to update streak:", error);
        }
      }
    } else {
      console.log("Streak already claimed for today");
    }
  };

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
          style={tw`h-440px mt-[-120px] w-[${screenWidth}px]`}
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
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <ScrollView>
        <StatusBar />
        <View style={tw`relative`}>
          <Image
            source={require("./../assets/homePage/cardhoem.png")}
            style={tw`w-full h-60 mb-5`}
            resizeMode="stretch"
          />

          <View
            style={tw`flex-row items-center justify-between px-5 absolute top-5 left-0 right-0 z-10`}
          >
            <Image
              source={require("./../assets/homePage/Logo-transparan.png")}
              style={tw`h-10 w-10 ml-[-10px] mt-2.5`}
            />

            <View style={tw`flex-row items-center`}>
              <Ionicons
                name="flash-outline"
                size={24}
                color="white"
                style={tw`mt-3.5 ml-5`}
                onPress={openModal}
              />
              <Ionicons
                name="notifications"
                size={24}
                color="white"
                style={tw`mt-3.5 ml-5`}
                onPress={() => navigation.navigate("faq")}
              />
            </View>
          </View>
          <View
            style={tw`flex-row items-center absolute mt-18 left-5 z-10 gap-24`}
          >
            <View>
              <Text style={tw`text-white text-base mr-3`}>
                Halo, {fullname}!
              </Text>
            </View>

            <View
              style={tw`flex-row items-center mr-3 bg-gray-400 p-1 rounded-3xl`}
            >
              <Image
                source={require("./../assets/homePage/XP.png")}
                style={tw`w-4 h-4 mr-1`}
              />
              <Text style={tw`text-white text-sm mr-4`}>{xp}</Text>
              <Image
                source={require("./../assets/homePage/coins.png")}
                style={tw`w-4 h-4 mr-1`}
              />
              <Text style={tw`text-white text-sm`}>{coins}</Text>
            </View>
          </View>

          <Text style={tw`text-white text-sm text-center top-[-150px] z-10`}>
            Dashboard Keuntungan Bulan Ini
          </Text>
        </View>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-70`}
          >
            <View
              style={tw`w-80 p-6 bg-white items-center rounded-2xl`} // Styling seperti View
            >
              <TouchableOpacity
                style={tw`absolute top-3 right-3 `}
                onPress={closeModal} // Close modal on press
              >
                <Ionicons name="close" size={24} color="#BB1624" />
              </TouchableOpacity>

              {/* Streak Info */}
              <View style={tw`flex-row mb-6 gap-24`}>
                <View>
                  <Text style={tw`text-left text-black`}>
                    Trek Belajar Kamu
                  </Text>
                  <Text style={tw`text-2xl text-black`}>
                    {streak} <Text style={tw`text-xl`}>Hari</Text>
                  </Text>
                </View>
                <Ionicons name="flash-outline" size={58} color="#BB1624" />
              </View>

              {/* Progress Bar */}
              <View style={tw`w-full bg-gray-300 rounded-full h-2.5 mb-4`}>
                <View
                  style={tw`bg-[#BB1624] h-full rounded-full`}
                  width={`${(streak % 7) * (100 / 7)}%`}
                />
              </View>

              <Text style={tw`text-sm text-gray-700 mb-4`}>
                Reward untuk kamu!
              </Text>

              <View
                style={tw`flex-row justify-evenly items-center w-full mb-6`}
              >
                <View style={tw` flex-row gap-2 items-center`}>
                  <Image
                    source={require("./../assets/homePage/XP.png")}
                    style={tw`w-10 h-10`}
                  />
                  <Text style={tw`mt-1`}>{xp}</Text>
                </View>
                <View style={tw`flex-row gap-2 items-center`}>
                  <Image
                    source={require("./../assets/homePage/coins.png")}
                    style={tw`w-10 h-10`}
                  />
                  <Text style={tw`mt-1`}>{coins}</Text>
                </View>
              </View>

              <Text style={tw`text-xs mb-2 text-gray-700`}>
                Kumpulkan poin dan dapatkan hadiahnya
              </Text>

              <TouchableOpacity
                style={tw`bg-[#BB1624] rounded-lg w-55 py-2 items-center`}
                onPress={claimStreak}
              >
                <Text style={tw`text-white text-sm `}>Klaim Sekarang!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View>
          <FlatList
            data={carouselData}
            showsHorizontalScrollIndicator={false}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled={true}
            onScroll={handleScroll}
            snapToAlignment="center" // Snap to center for smoother scrolling
            decelerationRate="fast" // Faster scrolling for better UX
          />
          <View style={tw`flex-row justify-center mt-[-120px]`}>
            {renderDotIndicators()}
          </View>
        </View>

        {/* Card lesson yang dipilih user */}
        <View style={tw`flex-row justify-between mx-5 mt-5`}>
          <Text style={tw`font-bold`}>Lanjutkan Belajar</Text>
          <Text
            style={tw`text-[#BB1624]`}
            onPress={() => navigation.navigate("myCourses")}
          >
            Lihat Semua
          </Text>
        </View>

        <View style={tw`px-5 mt-5`}>
          {course.map((courseItem, index) => {
            const completedPercentage = courseItem.moduleProgress;
            return (
              <ImageBackground
                key={index}
                source={require('../assets/homePage/cardd.png')}
                style={tw`bg-white rounded-full p-3 shadow-lg flex-row`}
                onPress={() =>
                  navigation.navigate("ventureCapital", {
                    courseId: courseItem.courseId,
                  })
                }
               >
                <View style={tw`flex-col items-center`}>

                  <Image
                  source={courseItem.image}
                  style={tw`w-25 h-25 rounded-lg`}
                  
                />
                <Text style={tw`text-sm text-neutral-300`}>
                    {courseItem.totalModules} Modules
                  </Text>
                </View>
                

                <View style={tw`ml-4 flex-1`}>
                  <Text style={tw`text-sm text-white mt-4`}>
                    {courseItem.category}
                  </Text>
                  <Text style={tw`text-base text-neutral-200`}>
                    {courseItem.title}
                  </Text>
                  
                  <View style={tw`mt-2`}>
                    <Text style={tw`text-sm text-white`}>
                      Complete {Math.floor(completedPercentage)}%
                    </Text>
                    <View style={tw`w-full h-2 bg-gray-300 rounded-full mt-1`}>
                      <View
                        style={[
                          tw`h-full bg-[#BB1624] rounded-full`,
                          { width: `${completedPercentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </ImageBackground>
            );
          })}
        </View>

        <View style={tw`mx-5 mt-5`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`font-bold`}>Pilihan Lesson</Text>
              {/* <View style={tw`bg-yellow-200 px-2 ml-2 rounded-full`}>
                <Text style={tw`text-yellow-600 text-xs font-bold`}>Pro</Text>
              </View> */}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("programList")}
            >
              <Text style={tw`text-[#BB1624]`}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {/* Menggunakan FlatList untuk menampilkan card dengan data dinamis */}
          <View style={tw`flex-row justify-between mb-12 flex-wrap`}>
            {cardData.map((card, index) => (
              <CardItem
                key={index}
                imageSource={card.imageSource}
                title={card.title}
                // label={card.label}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainApp;
