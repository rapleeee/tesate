import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import { Button, Icon } from 'react-native-elements';
import { doc, getDoc } from 'firebase/firestore';

export default function Akun() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userUID, setUserUID] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [totalScore, setTotalScore] = useState(null);
  const [fullname, setFullName] = useState('');

  const loadUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  };

  const calculateAverageScore = (scores) => {
    const totalScores = Object.values(scores).reduce((acc, score) => acc + score, 0);
    return Math.floor(totalScores / 3); // Dividing by 3 assuming there are 3 quizzes
  };

  const fetchUserData = async (uid) => {
    const userData = await loadUserData(uid);
    if (userData) {
      setUserEmail(userData.email);
      setFullName(userData.fullname);
      if (userData.scores) {
        setTotalScore(calculateAverageScore(userData.scores));
      } else {
        setTotalScore(null); // If scores do not exist
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

  const handleRefresh = () => {
    fetchUserData(userUID);
    console.log('ter refresh');
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

  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar />
        <View style={{ backgroundColor: 'darkred', padding: 80 }}>
          <Text style={{ color: 'white', textAlign: 'center', marginTop: -60, fontSize: 20 }}>Profile</Text>
          <TouchableOpacity onPress={handleRefresh} style={{ position: 'absolute', top: 21, right: 20 }}>
            <Icon name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#F1F1EF', borderBottomWidth: 1, borderColor: 'lightgrey', paddingBottom: 20 }}>
          <Image source={require('./../assets/Logo.png')} style={{ height: 150, width: 150, alignSelf: 'center', marginTop: -80 }} />
          <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>{fullname}</Text>
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <Text style={{ padding: 10, backgroundColor: 'lightgrey', width: '80%', textAlign: 'center' }}>{userEmail}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.scoreText}>Your Score: {totalScore !== null ? totalScore : 'Not available'}</Text>
        </View>
        <View style={{ flexDirection: 'row', margin: 20, marginBottom: 5, marginTop: 130 }}>
          <MaterialIcons name="discount" size={24} color="black" />
          <Text style={{ marginLeft: 8, fontWeight: 'bold', color: 'black' }}>Voucher Discount</Text>
          <AntDesign name="right" size={20} color="black" style={{ marginLeft: 'auto' }} />
        </View>
        <View style={{ flexDirection: 'row', margin: 20, marginBottom: 5 }}>
          <MaterialIcons name="support-agent" size={24} color="black" />
          <Text style={{ marginLeft: 8, fontWeight: 'bold', color: 'black' }}>Support</Text>
          <AntDesign name="right" size={20} color="black" style={{ marginLeft: 'auto' }} />
        </View>
        <View style={{ flexDirection: 'row', margin: 20, marginBottom: 5 }}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={{ marginLeft: 8, fontWeight: 'bold', color: 'black' }} onPress={() => navigation.navigate("settings")}>Settings</Text>
          <AntDesign name="right" size={20} color="black" style={{ marginLeft: 'auto' }} />
        </View>
        <View style={{ flexDirection: 'row', margin: 21 }}>
          <AntDesign name="logout" size={21} color="red" style={{ transform: [{ scaleX: -1 }] }} />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', color: 'red' }} onPress={handleLogout}>Logout</Text>
          <AntDesign name="right" size={20} color="red" style={{ marginLeft: 'auto' }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
