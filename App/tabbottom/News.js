import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { db } from "./../../firebase"; // import firebase setup
import { collection, onSnapshot } from "firebase/firestore";

// Fungsi untuk menghitung total skor atau rata-rata skor pengguna
const calculateTotalScore = (scores) => {
  // Jika totalScores ada, kembalikan totalScores
  if (scores.totalScore !== null && scores.totalScore !== undefined) {
    return scores.totalScore;
  }

  // Jika tidak ada totalScore, hitung dari objek skor yang diberikan
  const totalScores = Object.values(scores).reduce((acc, score) => acc + score, 0);

  // Hitung jumlah skor yang ada
  const numberOfScores = Object.values(scores).length;

  // Pastikan tidak ada pembagian dengan 0 dan kembalikan hasil total skor
  return numberOfScores > 0 ? Math.floor(totalScores / numberOfScores) : 0;
};

const News = () => {
  const [users, setUsers] = useState([]);
  const [countdown, setCountdown] = useState(3600); // 1 hour countdown (3600 seconds)

  // Mengambil data pengguna dari Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  // Countdown timer untuk hitungan mundur
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 3600));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format waktu countdown ke format HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Urutkan pengguna berdasarkan total skor tertinggi ke terendah
  const sortedUsers = users
    .map((user) => ({
      ...user,
      totalScore: calculateTotalScore(user.scores),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <StatusBar />

        {/* Header */}
        <View style={tw`flex-row items-center justify-between px-4 py-3 bg-white shadow`}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#787879" />
          </TouchableOpacity>
          <Text style={tw`text-lg text-gray-600`}>Leaderboard</Text>
          <TouchableOpacity>
            <Ionicons name="alert-circle-outline" size={24} color="#BB1624" />
          </TouchableOpacity>
        </View>

        {/* Konten */}
        <View style={tw`items-center px-4 py-5`}>
          {/* Card Section */}
          <View style={tw`w-4/5 bg-yellow-600 rounded-xl p-5 items-center mb-5`}>
            <Ionicons name="trophy-outline" size={100} color="#fff" style={tw`mb-2`} />
            <Text style={tw`text-lg text-white`}>Ambassador Elite</Text>
          </View>

          {/* Countdown Section */}
          <Text style={tw`text-gray-600 mb-2`}>Settlement Countdown:</Text>
          <View style={tw`flex-row items-center mb-5`}>
            <Ionicons name="timer-outline" size={24} color="#E91E63" />
            <Text style={tw`ml-2 text-lg text-pink-600`}>{formatTime(countdown)}</Text>
          </View>

          {/* Tabs */}
          <View style={tw`flex-row mb-5`}>
            <TouchableOpacity style={tw`flex-1 bg-[#BF3131] p-3 rounded-l-xl items-center`}>
              <Text style={tw`text-white font-bold`}>Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1 bg-gray-200 p-3 rounded-r-xl items-center`}>
              <Text style={tw`text-gray-600 font-bold`}>Global</Text>
            </TouchableOpacity>
          </View>

          {/* Ranking List */}
          <View style={tw`w-full`}>
            {/* Ranking Header */}
            <View style={tw`flex-row justify-between px-2 py-2 bg-red-200 rounded-t-xl`}>
              <Text style={tw`text-gray-800 font-bold flex-1`}>Ranking</Text>
              <Text style={tw`text-gray-800 font-bold flex-1 text-center`}>Name</Text>
              <Text style={tw`text-gray-800 font-bold flex-1 text-center`}>Point</Text>
              <Text style={tw`text-gray-800 font-bold flex-1 text-right`}>Reward</Text>
            </View>

            {/* Daftar Pengguna */}
            {sortedUsers.map((user, index) => (
              <View key={index} style={tw`flex-row items-center bg-red-500 p-3 rounded-xl mb-2 justify-between`}>
                {/* Ranking */}
                <View style={tw`w-7 h-7 bg-yellow-300 rounded-full items-center justify-center`}>
                  <Text style={tw`text-sm font-bold`}>{index + 1}</Text>
                </View>

                {/* Nama Pengguna */}
                <Text style={tw`flex-1 ml-3 text-base text-white`}>{user.fullname}</Text>

                {/* Total atau Rata-rata Skor */}
                <Text style={tw`flex-1 text-base font-bold text-white text-center`}>
                  {user.totalScore}
                </Text>

                {/* Placeholder untuk Reward */}
                <View style={tw`w-10 h-10 bg-white border border-yellow-500 rounded-md`} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default News;
