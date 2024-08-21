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
        <View style={styles.headerContainer}>
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
        <Text style={styles.umkm}>bodanana</Text>
        <View style={styles.classContainer}>
          <Text style={styles.classText}>Elite Ambasador</Text>
        </View>

        {/* Progress items dalam dua kolom */}
        <View style={styles.progressContainer}>
          {progressItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.progressItem}
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen); // Navigate to the specified screen
                }
              }}
            >
              <View style={styles.progressItemContent}>
                <View style={styles.iconProgresBase}>
                  <Ionicons name={item.icon} size={25} color="white" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.scoreText}>{item.value}</Text>
                  <Text style={styles.progressText}>{item.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* card expired subscription */}

        <View style={styles.subcribtionContainer}>
          <View>
          
            <Text style={{fontSize:24, fontWeight:'bold'}}>Starter</Text>
            <Text>Subcription expire on <Text style={{color:'blue'}}>01 May 2024</Text></Text>
          </View>
        </View>
        <View style={{backgroundColor:'darkred', padding:5, marginTop:-125, marginLeft:30, width:'30%', borderRadius:30}}>
            <Text style={{color:'white', textAlign:'center'}}>Current Plan</Text>
          </View>

        {/* Tombol Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
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
    top: 21,
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
    backgroundColor: 'orange',
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  progressContainer: {
    backgroundColor: '#F0F0F4',
    borderRadius: 20,
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginLeft:10,
    shadowColor: '#000', // Warna bayangan hitam
    shadowOffset: { width: 0, height: 4 }, // Posisi bayangan (ke bawah)
    shadowOpacity: 0.3, // Transparansi bayangan
    shadowRadius: 4.65, // Radius bayangan
    elevation: 8,
  },
  progressItem: {
    flexDirection: 'column',
    alignItems: 'left',
    width: '45%',
    marginBottom: -5,
    marginTop:10,
    marginLeft:15,
  },
  progressItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 5,
    marginBottom: 5,
  },
  iconProgresBase: {
    backgroundColor: 'darkred',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 10
  },
  progressText: {
    fontSize: 12,
    color: '#787879',
    textAlign: 'left',
  },
  subcribtionContainer:{
    backgroundColor: '#FFFFFD',
    marginTop: 25,
    borderRadius: 20,
    width: '95%',
    padding: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginLeft:10,
    shadowColor: '#000', // Warna bayangan hitam
    shadowOffset: { width: 0, height: 4 }, // Posisi bayangan (ke bawah)
    shadowOpacity: 0.3, // Transparansi bayangan
    shadowRadius: 4.65, // Radius bayangan
    elevation: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'darkred',
    width: 150,
    padding: 10,
    borderRadius: 30,
    marginLeft: 130,
    marginTop: 150,
    justifyContent: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
