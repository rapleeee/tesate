import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, 
  Alert, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import tw from 'twrnc';  // Import twrnc for Tailwind styling

export default function Akun() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userUID, setUserUID] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [totalScore, setTotalScore] = useState(null);
  const [fullname, setFullName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to load user data from Firestore
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

  // Function to calculate the average score
  const calculateAverageScore = (scores) => {
    const totalScores = Object.values(scores).reduce((acc, score) => acc + score, 0);
    return Math.floor(totalScores / 3);
  };

  // Function to fetch and set user data
  const fetchUserData = async (uid) => {
    const userData = await loadUserData(uid);
    if (userData) {
      setUserEmail(userData.email);
      setFullName(userData.fullname);
      if (userData.scores) {
        setTotalScore(calculateAverageScore(userData.scores));
      } else {
        setTotalScore(null);
      }
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

  // Function to handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserData(userUID);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Halaman ter-refresh');
    }, 2000);
  };

  // Function to handle logout
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

  const progressItems = [
    { text: 'Lesson', icon: 'book', value: '10' },
    { text: 'Waktu Belajar', icon: 'time', value: '2 h 30 m' },
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
        {/* Header dan informasi pengguna */}
        <StatusBar />
        <View>
          <Image
            source={require("./../assets/AkunPage/Promotion.png")}
            style={tw`w-full h-50 mb-15`}
            resizeMode="stretch"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("settings")}
            style={styles.settingsIcon}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <Image source={require("./../assets/Logo.png")} style={styles.logo} />
        </View>
        <Text style={styles.fullName}>{fullname}</Text>
        <Text style={styles.umkm}>Kopi Konco</Text>
        <View style={styles.classContainer}>
          <Text style={styles.classText}>Elite Ambasador</Text>
        </View>

        {/* Progress items dalam dua kolom */}
        <View
          style={tw`flex-row flex-wrap justify-between bg-[#F2F2F2] p-4 rounded-lg mx-2 border border-gray-300`}
        >
          {progressItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`w-1/2 p-2`} // Menentukan ukuran lebar elemen untuk membuatnya responsif
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen); // Navigasi ke layar yang ditentukan
                }
              }}
            >
              <View style={tw`flex-row items-center`}>
                <View
                  style={tw`bg-[#BB1624] w-12 h-12 rounded-full flex items-center justify-center mr-3`}
                >
                  <Ionicons name={item.icon} size={25} color="white" />
                </View>
                <View>
                  <Text style={tw`text-lg font-bold text-black`}>
                    {item.value}
                  </Text>
                  <Text style={tw`text-sm text-gray-500`}>{item.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* card expired subscription */}

        <View style={tw`bg-[#F2F2F2] rounded-lg p-4 mx-2 relative mt-10 border border-gray-300`}>
          {/* Kontainer Utama */}
          <View>
            <Text style={tw`text-xl font-bold`}>Starter</Text>
            <Text style={tw`text-base`}>
              Subscription expire on{" "}
              <Text style={tw`text-blue-500`}>01 May 2024</Text>
            </Text>
          </View>

          {/* Label Current Plan */}
          <View
            style={tw`bg-[#BB1624] px-3 py-1 rounded-full absolute -top-3 left-4`}
          >
            <Text style={tw`text-white text-center text-sm`}>Current Plan</Text>
          </View>
        </View>

        {/* Tombol Logout */}
        
        <TouchableOpacity style={tw`bg-[#BB1624] h-10 mx-12 mt-8 rounded-full justify-center items-center shadow-lg`} onPress={handleLogout}>
          <Text style={tw`text-white font-bold text-sm`}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'darkred',
    padding: 150,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  settingsIcon: {
    position: 'absolute',
    top: 40, // Adjusted so it's not hidden by the image
    right: 20,
  },
  userInfoContainer: {
    backgroundColor: '#F1F1EF',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    paddingBottom: 20,
  },
  logo: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginTop: -250,
  },
  fullName: {
    textAlign: 'center',
    marginTop: -170,
    fontSize: 20,
    color: 'white',
  },
  umkm: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
  },
  classContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  classText: {
    padding: 10,
    backgroundColor: '#EF980C',
    width: '50%',
    textAlign: 'center',
    color: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
 
  
});
