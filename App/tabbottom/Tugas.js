import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import tw from "twrnc";
import { db, auth } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function Tugas({ navigation }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [xp, setXp] = useState(0); // XP Harian
  const [coins, setCoins] = useState(0);
  const [isTopThree, setIsTopThree] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserPosition, setCurrentUserPosition] = useState(null);
  const [studyTime, setStudyTime] = useState(0);
  const [quizAnswersCorrect, setQuizAnswersCorrect] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserData();
    monitorStudyTime();
  }, []);

  const fetchLeaderboard = () => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        totalScore: doc.data().scores
          ? Object.values(doc.data().scores).reduce((a, b) => a + b, 0)
          : 0,
      }));

      const sortedUsers = usersList
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);
      setLeaderboard(sortedUsers);

      const currentUser = auth.currentUser;
      const position = sortedUsers.findIndex(
        (user) => user.id === currentUser?.uid
      );
      setCurrentUserPosition(position + 1);
      setIsTopThree(position >= 0 && position < 3);
    });

    return () => unsubscribe();
  };

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        // Real-time update listener
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();

            // Ambil langsung XP dari database
            const userXp = userData.xp || 0;
            setXp(userXp); // Langsung set XP dari database
            setCoins(userData.coins || 0);
          }
        });

        return () => unsubscribe(); // Hentikan listener ketika komponen di-unmount
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const monitorStudyTime = () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    const startTimer = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        // Fetch current study time or initialize if not set
        const userDoc = await getDoc(userDocRef);
        let currentMinutes = 0;

        if (userDoc.exists()) {
          const studyTime = userDoc.data().studyTime;
          if (studyTime?.date === today) {
            currentMinutes = studyTime.minutes;
          }
        }

        // Start tracking study time
        const interval = setInterval(async () => {
          try {
            currentMinutes += 1; // Increment study time by 1 minute
            await updateDoc(userDocRef, {
              studyTime: {
                date: today,
                minutes: currentMinutes,
              },
            });

            // Update state locally for immediate UI feedback
            setStudyTime(currentMinutes);
          } catch (error) {
            console.error("Error updating study time:", error);
          }
        }, 60000); // Increment every 1 minute

        return interval; // Return interval reference for cleanup
      } catch (error) {
        console.error("Error starting study time timer:", error);
      }
    };

    // Call startTimer and ensure cleanup on unmount
    const interval = startTimer();
    return () => clearInterval(interval);
  };

  useEffect(() => {
    const cleanup = monitorStudyTime();
    return cleanup;
  }, []);

  const handleClaimReward = async () => {
    if (xp >= 30 && quizAnswersCorrect >= 10 && studyTime >= 5 && isTopThree) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            xp: xp + 100,
            coins: coins + 100,
          });

          Alert.alert(
            "Selamat!",
            "Anda telah mengklaim hadiah 100 XP dan 100 coins!"
          );
          fetchUserData();
        }
      } catch (error) {
        console.error("Error claiming reward:", error);
      }
    } else {
      Alert.alert(
        "Belum Bisa Klaim",
        "Pastikan semua tantangan selesai dan Anda berada di 3 besar leaderboard."
      );
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLeaderboard();
    fetchUserData();
    setTimeout(() => setIsRefreshing(false), 2000);
  };
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100 `}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={tw`relative `}>
          <ImageBackground
            source={require("./../assets/AkunPage/cardAcc.png")}
            style={tw`w-full h-55`}
          >
            <View style={tw`items-center justify-between flex-row p-6`}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
              <Text style={tw`text-white text-xl`}>Reward</Text>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="white"
              />
            </View>

            <View
              style={[
                tw`mx-18 p-4 rounded-lg flex-row items-center justify-center`,
                { backgroundColor: "rgba(250, 250, 250, 0.1)" },
              ]}
            >
              <View style={tw`items-center flex justify-center`}>
                <Text style={tw`text-[#E1BF8F] text-xs`}>Koin Kamu</Text>
                <View style={tw`flex-row items-center justify-center gap-2`}>
                  <Text style={tw`text-gray-200 text-3xl`}>{coins}</Text>
                  <Image
                    source={require("./../assets/homePage/coins.png")}
                    style={tw`w-6 h-6`}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={tw`items-center justify-center bg-[#EF980C] p-2 mt--4 mx-34 rounded-lg z-10`}
              onPress={handleClaimReward}
            >
              <Text style={tw`text-gray-200 text-xs`}>Klaim Hadiah</Text>
            </TouchableOpacity>

            <Text style={tw`text-gray-300 text-xs m-2 text-center`}>
              Ikuti tantangan dan dapatkan hadiahnya!
            </Text>
          </ImageBackground>
        </View>

        <View style={tw`flex-1 p-4 m-4 rounded-lg bg-[#FFB8B8] shadow-md`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-gray-700 text-base`}>Tantangan Harian</Text>
            <View style={tw`flex-row items-center justify-between gap-2`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={require("./../assets/homePage/XP1.png")}
                  style={tw`w-8 h-8`}
                />
                <Text style={tw`text-gray-700 text-sm`}>100</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={require("./../assets/homePage/coins.png")}
                  style={tw`w-8 h-8`}
                />
                <Text style={tw`text-gray-700 text-sm`}>100</Text>
              </View>
            </View>
          </View>

          {/* Daily Challenges */}
          <View style={tw`p-4 bg-white rounded-lg shadow-md`}>
            <Text>Dapatkan 30 XP</Text>
            <View style={tw`w-full bg-gray-300 rounded-full h-3 mt-2`}>
              <View
                style={tw`bg-[#BB1624] h-full rounded-full`}
                width={`${Math.min((xp / 30) * 100, 100)}%`} // Batasi maksimum 100%
              />
            </View>
          </View>

          <View style={tw`p-4 bg-white rounded-lg shadow-md mt-4`}>
            <Text>Jawab 10 Pertanyaan Benar</Text>
            <View style={tw`w-full bg-gray-300 rounded-full h-3 mt-2`}>
              <View
                style={tw`bg-[#BB1624] h-full rounded-full`}
                width={`${(quizAnswersCorrect / 10) * 100}%`}
              />
            </View>
          </View>
          <View style={tw`p-4 bg-white rounded-lg shadow-md mt-4`}>
            <Text>Belajar Selama 5 Menit</Text>
            <View style={tw`w-full bg-gray-300 rounded-full h-3 mt-2`}>
              <View
                style={tw`bg-[#BB1624] h-full rounded-full`}
                width={`${Math.min((studyTime / 5) * 100, 100)}%`} // Batasi maksimum ke 100%
              />
            </View>
          </View>
        </View>

        <View
          style={tw`flex-1 p-4 m-4 rounded-lg bg-[#FFB8B8] shadow-md mb-12`}
        >
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-700 text-base`}>Kuis Mingguan</Text>
            <View style={tw`flex-row items-center justify-between gap-4`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={require("./../assets/homePage/XP1.png")}
                  style={tw`w-8 h-8`}
                />
                <Text style={tw`text-gray-700 text-sm`}>150</Text>
              </View>
            </View>
          </View>

          <View style={tw`p-2 bg-white rounded-lg mt-4 shadow-md`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-gray-700 text-sm`}>
                Ikut kuis, dapatkan tambahan XP
              </Text>
              <TouchableOpacity
                style={tw`bg-[#BB1624] rounded-xl px-4 py-2 flex-row gap-2 items-center`}
              >
                <Image
                  source={require("./../assets/homePage/coins.png")}
                  style={tw`w-6 h-6`}
                />
                <Text style={tw`text-white text-sm`}>10</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
