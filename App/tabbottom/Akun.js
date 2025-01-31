import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity,
  Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import tw from 'twrnc';
import Text from '../Shared/Text';


export default function Akun() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userUID, setUserUID] = useState('');
  const [fullname, setFullName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [email, setEmail] = useState('Email belum terdaftar');
  const [address, setAddress] = useState('Alamat belum terdaftar');
  const [phoneNumber, setPhoneNumber] = useState('');


  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFullName(userData.fullname || "Guest");
        setEmail(userData.email || "Kamu belum set email");
        setPhoneNumber(userData.phoneNumber || "");
        setAddress(userData.address || "Kamu belum set alamat");
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserUID(user.uid);
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


  return (
    <SafeAreaView style={tw`flex-1 bg-[#5CB85C]  `}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      >

        <View style={tw`flex-row items-center justify-between px-4`}>
          <AntDesign name='arrowleft' size={24} color={'white'} />
          <Text style={tw`text-2xl text-neutral-100 font-bold text-center`}>Akun</Text>
          <AntDesign name='setting' size={24} color={'white'} />
        </View>

        <View style={tw`bg-neutral-100 rounded-t-3xl w-full h-full flex items-start justify-center mt-24 p-4`}>
          <View style={tw`w-full`}>
            <View style={tw`bg-neutral-100 py-2 px-4 rounded-lg shadow-md border border-gray-200 mb-2`}>
              <Text style={tw`text-base text-neutral-700 text-left`}>{fullname}</Text>
            </View>
            <View style={tw`bg-neutral-100 py-2 px-4 rounded-lg shadow-md border border-gray-200 mb-2`}>
              <Text style={tw`text-base text-neutral-700 text-left`}>{email}</Text>
            </View>
            <View style={tw`bg-neutral-100 py-2 px-4 mb-24 rounded-lg shadow-md border border-gray-200 mb-2`}>
              <Text style={tw`text-base text-neutral-700 text-left`}>{address}</Text>
            </View>
      <TouchableOpacity style={tw`bg-neutral-800 rounded-t-3xl w-full h-16 flex items-start justify-center mt-24 p-4`} onPress={handleLogout}>
        <Text>Logout</Text>
        </TouchableOpacity>
          </View>
            <Text>Kebijakan Privasi</Text>
            <Text>Riwayat Orderan</Text>
          </View>

      </ScrollView>
    </SafeAreaView>
  );
}

