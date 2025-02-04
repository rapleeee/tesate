import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity,
  Alert, RefreshControl,
  Modal,
  TextInput,
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
  const [modalVisible, setModalVisible] = useState(false); 


  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFullName(userData.fullname || "Tamu");
        setEmail(userData.email || "Kamu belum set email");
        setPhoneNumber(userData.phoneNumber || "");
        setAddress(userData.address || "Kamu belum set alamat");
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const updateUserDetails = async () => {
    try {
      const userDocRef = doc(db, 'users', userUID);
      await updateDoc(userDocRef, { 
        fullname, 
        email, 
        phoneNumber,
        address // Menambahkan address agar tersimpan di database
      });
      Alert.alert("Success", "Profile details updated successfully!");
      setModalVisible(false); 
    } catch (error) {
      console.error("Error updating user details in Firestore: ", error);
      Alert.alert("Error", "Failed to update profile details.");
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

  return (
    <SafeAreaView style={tw` bg-[#5CB85C]`}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={tw`flex-row items-center justify-between px-4 `}>
          <AntDesign name="arrowleft" size={24} color={"white"} />
          <Text style={tw`text-2xl text-neutral-100 font-bold text-center`}>
            Akun
          </Text>
          <AntDesign name="setting" size={24} color={"white"} />
        </View>

        <View
          style={tw`bg-neutral-100 rounded-t-3xl w-full h-full items-center flex mt-32 px-8 py-24`}
        >
          <View style={tw`w-full `}>
            <View
              style={tw`bg-neutral-100 py-2 px-4 rounded-lg shadow-md border border-gray-200 mb-2`}
            >
              <Text style={tw`text-base text-neutral-700 text-left`}>
                {fullname}
              </Text>
            </View>
            <View
              style={tw`bg-neutral-100 py-2 px-4 rounded-lg shadow-md border border-gray-200 mb-2`}
            >
              <Text style={tw`text-base text-neutral-700 text-left`}>
                {email}
              </Text>
            </View>
            <View
              style={tw`bg-neutral-100 py-2 px-4 mb-24 rounded-lg shadow-md border border-gray-200 mb-2`}
            >
              <Text style={tw`text-base text-neutral-700 text-left`}>
                {address}
              </Text>
            </View>
            <View style={tw`items-start gap-y-4 mt-6`}>
              <View style={tw`flex-row justify-between items-center w-full`}>
                <Text>Kebijakan Privasi</Text>
                <AntDesign name="right" size={18} color="grey" />
              </View>
              <View style={tw`flex-row justify-between items-center w-full`}>
                <Text>Riwayat Orderan</Text>
                <AntDesign name="right" size={18} color="grey" />
              </View>
            </View>
            <TouchableOpacity
              style={tw`bg-neutral-800 rounded-lg w-full h-12 flex items-center justify-center mt-18`}
              onPress={() => setModalVisible(true)}
            >
              <Text style={tw`text-white`}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-red-700 rounded-lg w-full h-12 flex items-center justify-center mt-2`}
              onPress={handleLogout}
            >
              <Text style={tw`text-white`}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal visible={modalVisible} animationType="slide">
        <View style={tw`flex-1 justify-center items-center bg-white p-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Edit Akun Kamu</Text>
          <TextInput
            style={tw`border border-gray-400 w-full p-2 rounded-lg mb-4`}
            placeholder="Full Name"
            value={fullname}
            onChangeText={setFullName}
          />
          <TextInput
            style={tw`border border-gray-400 w-full p-2 rounded-lg mb-4`}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={tw`border border-gray-400 w-full p-2 rounded-lg mb-4`}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            style={tw`border border-gray-400 w-full p-2 rounded-lg mb-4`}
            placeholder="Alamat Lengkap ya"
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity
            style={tw`bg-[#5CB85C] rounded-lg p-3 w-full mt-2`}
            onPress={updateUserDetails}
          >
            <Text style={tw`text-white text-center`}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 rounded-lg p-3 w-full mt-2`}
            onPress={() => setModalVisible(false)}
          >
            <Text style={tw`text-white text-center`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

