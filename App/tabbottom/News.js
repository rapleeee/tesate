import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "react-native-vector-icons";
import tw from "twrnc";
import { db } from "./../../firebase"; 
import { collection, onSnapshot } from "firebase/firestore";

// Fungsi untuk menghitung waktu tersisa hingga pergantian hari (jam 00:00)
const calculateTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Set waktu ke 00:00 besok
  const timeRemaining = midnight - now; // Selisih waktu dalam milidetik
  return timeRemaining;
};

const News = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [countdown, setCountdown] = useState(calculateTimeUntilMidnight()); 
  const [currentMonth, setCurrentMonth] = useState('');

  // Mengambil data pengguna dari Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date();
    const month = monthNames[date.getMonth()];
    setCurrentMonth(month);

    return () => unsubscribe();
  }, []);

  // Countdown timer untuk hitungan mundur hingga pergantian hari
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1000 : calculateTimeUntilMidnight()
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format waktu countdown ke format HH:MM:SS
  const formatTime = (timeInMillis) => {
    const hours = Math.floor(timeInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((timeInMillis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeInMillis % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Urutkan pengguna berdasarkan total skor tertinggi ke terendah untuk peringkat saja
  const sortedUsers = users
    .map((user) => ({
      ...user,
      totalScore: user.scores ? Object.values(user.scores).reduce((a, b) => a + b, 0) : 0, // Hitung total score
    }))
    .sort((a, b) => b.totalScore - a.totalScore) // Urutkan berdasarkan score tertinggi
    .slice(0, 10); // Batasi ke 10 besar

  return (
    <SafeAreaView style={[
      tw`flex-1`,
      { backgroundColor: 'rgba(255, 182, 182, 0.3)' } // Warna pink dengan opacity 30%
    ]}
    >
      <View
        
        >
        <ScrollView>
          <StatusBar />

          <View style={tw`flex-row justify-between z-10 mt-4`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`left-5`}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-base`}>Leaderboard</Text>
            <TouchableOpacity onPress={() => alert("Notifikasi")} style={tw`right-5`}>
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bagian gambar leaderboard */}
          <View style={tw`relative mt-[-64]`}>
            <Image
              source={require("./../assets/leaderboard/cardhead.png")} 
              style={tw`w-full h-70 mb-15`}
              resizeMode="stretch"
            />
            <View style={tw`absolute w-full items-center mt-18`}>
              <Image source={require("./../assets/leaderboard/gold.png")} style={tw`w-24 h-24 mt-2`} />
              <View style={tw` mt-4`}>
                <Text style={tw`text-white text-xl`}>{currentMonth}</Text>
              </View>
              <Text style={tw`text-white mt-2`}>Masuk 3 besar dan dapatkan hadiah!</Text>
            </View>
          </View>

          {/* Countdown waktu reset */}
          <Text style={tw`text-gray-700 text-center mb-2 mt-[-52]`}>Reset dalam:</Text>
          <View style={tw`flex-row justify-center items-center mb-5`}>
            <Ionicons name="timer-outline" size={24} color="#BB1624" />
            <Text style={tw`ml-2 text-lg text-[#BB1624]`}>{formatTime(countdown)}</Text>
          </View>

          {/* Leaderboard List */}
          <View style={tw`w-full px-4`}>
            {sortedUsers.map((user, index) => (
              <View
                key={user.id}
                style={tw`flex-row items-center p-2 rounded-2xl mb-2 justify-between gap-4 bg-[rgba(128,128,128,0.3)]`}
              >
                {/* Ranking */}
                {index + 1 <= 3 ? (
                  <Image
                    source={
                      index === 0
                        ? require('./../assets/leaderboard/medal1.png')
                        : index === 1
                        ? require('./../assets/leaderboard/medal2.png')
                        : require('./../assets/leaderboard/medal3.png')
                    }
                    style={tw`w-7 h-7`}
                  />
                ) : (
                  <View style={tw`w-7 h-7 rounded-full items-center justify-center`}>
                    <Text style={tw`text-sm text-gray-700 font-bold`}>{index + 1}</Text>
                  </View>
                )}

                {/* Foto Profil dari Database atau Placeholder */}
                <View style={tw`w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3`}>
                  {user.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={tw`w-full h-full rounded-full`} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={24} color="#fff" />
                  )}
                </View>

                {/* Nama Pengguna */}
                <Text style={tw`flex-1 text-base text-gray-700`}>{user.fullname || "-"}</Text>

                {/* Total XP yang disimpan */}
                <Text style={tw`text-base text-gray-700`}>
                  {user.xp ? `${user.xp} XP` : "-"}  {/* Menampilkan XP yang tersimpan */}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default News;
