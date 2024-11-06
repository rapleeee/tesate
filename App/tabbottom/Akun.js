import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, Image, TouchableOpacity, 
  Alert, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import tw from 'twrnc';

export default function Akun() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userUID, setUserUID] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [totalScore, setTotalScore] = useState(null);
  const [fullname, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState(null); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [coursesCompleted, setCoursesCompleted] = useState(0); 
  const [modulesTaken, setModulesTaken] = useState(0);  
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);  


  const loadUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  };


  const calculateAverageScore = (scores) => {
    const totalScores = Object.values(scores).reduce((acc, score) => acc + score, 0);
    return Math.floor(totalScores / 3);
  };


  const calculateTotalTimeSpent = (quizzes) => {
    if (!quizzes) return 0;
    const totalTime = quizzes.reduce((acc, quiz) => acc + (quiz.timeSpent || 0), 0);
    return totalTime;
  };


  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes} m`;
  };


  const fetchUserData = async (uid) => {
    const userData = await loadUserData(uid);
    if (userData) {
      console.log("Data user:", userData);
      setUserEmail(userData.email);
      setFullName(userData.fullname);
      setProfileImage(userData.profileImage || null); 
      setBusinessName(userData.businessName);
      if (userData.scores) {
        setTotalScore(calculateAverageScore(userData.scores));
      } else {
        setTotalScore(null);
      }
      setCoursesCompleted(userData.coursesCompleted || 0);  
      
      const userModules = userData.modulesTaken || [];  
      setModulesTaken(userModules.length); 

      const quizzes = userData.quizzes || [];  
      const totalTime = calculateTotalTimeSpent(quizzes);
      setTotalTimeSpent(totalTime);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserUID(user.uid);
        setUserEmail(user.email);
        fetchUserData(user.uid); 
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userUID) {
        fetchUserData(userUID);
      }
    }, [userUID])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserData(userUID);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Halaman ter-refresh');
    }, 2000);
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log("Logout successful");
        navigation.navigate("signin");
      })
      .catch((error) => {
        console.log("Logout error:", error);
        Alert.alert("Logout error", error.message);
      });
  };

  // Fungsi untuk menambah modul yang telah diambil oleh user
  const addModuleToUser = async (uid, moduleId) => {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, {
        modulesTaken: arrayUnion(moduleId) 
      });
      console.log("Module added successfully");
    } catch (error) {
      console.error("Failed to add module:", error);
    }
  };

  // Daftar item progress yang akan ditampilkan di halaman akun
  const progressItems = [
    { text: 'Lesson', icon: 'book', value: modulesTaken }, 
    { text: 'Waktu Belajar', icon: 'time', value: formatTimeSpent(totalTimeSpent) },  // Displaying total time spent
    { text: 'Point', icon: 'newspaper', value: totalScore !== null ? totalScore : "Not available", screen: 'detailScore' },
    { text: 'Akurasi', icon: 'speedometer', value: '70%' },
  ];

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <StatusBar />
        <View style={tw`relative`}>
          <Image
            source={require("./../assets/AkunPage/Promotion.png")}
            style={tw`w-full h-50 mb-15`}
            resizeMode="stretch"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("settings")}
            style={tw`absolute top-10 right-5`} 
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>

          <View style={tw`absolute w-full items-center top-10`}>
            <Image 
              source={profileImage ? { uri: profileImage } : require("./../assets/Logo.png")} 
              style={tw`h-18 w-18 rounded-full border-4 border-[#EF980C]`} 
            />
            <Text style={tw`text-xl text-white mt-3`}>{fullname}</Text>
            <Text style={tw`text-sm text-white`}>{businessName}</Text>
            <View style={tw`bg-[#EF980C] px-4 py-2 rounded-md mt-2`} >
              <Text style={tw`text-white text-center`} onPress={() => navigation.navigate("news")}>Elite Ambasador</Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row flex-wrap justify-between bg-gray-200 p-4 rounded-lg mx-2 border border-gray-300 mt-5`}>
          {progressItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`w-1/2 p-2`} 
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen); 
                }
              }}
            >
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-red-700 w-12 h-12 rounded-full flex items-center justify-center mr-3`}>
                  <Ionicons name={item.icon} size={25} color="white" />
                </View>
                <View>
                  <Text style={tw`text-lg font-bold text-black`}>{item.value}</Text>
                  <Text style={tw`text-sm text-gray-500`}>{item.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`bg-gray-200 rounded-lg p-4 mx-2 relative mt-10 border border-gray-300`}>
          <View>
            <Text style={tw`text-xl font-bold`}>Starter</Text>
            <Text style={tw`text-base`}>
              Subscription expire on{" "}
              <Text style={tw`text-blue-500`}>01 May 2024</Text>
            </Text>
          </View>

          <View style={tw`bg-red-700 px-3 py-1 rounded-full absolute -top-3 left-4`}>
            <Text style={tw`text-white text-center text-sm`}>Current Plan</Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between m-3`}>
          <Text style={tw`text-base font-bold text-red-700`}>Achievement</Text>
          <Text>See All</Text>
            
        </View>
          <View style={tw`py-10 px-20 bg-gray-700 m-3 rounded-lg`}>
          </View>

        <TouchableOpacity style={tw`bg-red-700 h-10 mx-12 mt-8 rounded-full justify-center items-center shadow-lg`} onPress={handleLogout}>
          <Text style={tw`text-white font-bold text-sm`}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
