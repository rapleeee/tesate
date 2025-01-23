import { 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert, 
  Pressable 
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase'; // Pastikan Anda memiliki Firestore di firebase.js
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import tw from 'twrnc';
import Text from '../Shared/Text';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  // Google Auth Provider
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '826300876657-lk3bji4sc7sj7i7iptdcs5eqehnmkbg7.apps.googleusercontent.com',
    iosClientId: '826300876657-lk3bji4sc7sj7i7iptdcs5eqehnmkbg7.apps.googleusercontent.com',
    expoClientId: '826300876657-lk3bji4sc7sj7i7iptdcs5eqehnmkbg7.apps.googleusercontent.com',
  });

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  useEffect(() => {
    setLoading(true);

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        setLoading(false);
      } else {
        navigation.replace("MainApp");
      }
    });

    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        const savedPassword = await AsyncStorage.getItem('userPassword');
        if (savedEmail !== null && savedPassword !== null) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setIsRemembered(true);
        }
      } catch (error) {
        console.log('Failed to load credentials', error);
      }
    };

    loadCredentials();

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  const saveCredentials = async (email, password) => {
    try {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
    } catch (error) {
      console.log('Failed to save credentials', error);
    }
  };

  const removeCredentials = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userPassword');
    } catch (error) {
      console.log('Failed to remove credentials', error);
    }
  };

  const login = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password.", [{ text: "OK" }]);
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Cek jika email adalah admin@gmail.com
      if (email === "admin@gmail.com") {
        navigation.replace("adminPanel"); // Arahkan ke halaman AdminPanel
        return;
      }

      // Ambil data pengguna dari Firestore
      const userDocRef = doc(db, "users", user.uid); // Asumsi koleksi Firestore adalah "users"
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Cek role pengguna
        if (userData.role === "seller") {
          navigation.replace("adminPanel"); // Penjual diarahkan ke AdminPanel
        } else if (userData.role === "buyer") {
          navigation.replace("MainApp"); // Pembeli diarahkan ke MainApp
        } else {
          Alert.alert("Pesen!", "Makan Enak Hati Senang", [{ text: "OK" }]);
        }
      } else {
        Alert.alert("Error", "User data not found in Firestore.", [{ text: "OK" }]);
      }

      // Simpan atau hapus kredensial berdasarkan pilihan pengguna
      if (isRemembered) {
        saveCredentials(email, password);
      } else {
        removeCredentials();
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "Account not found.", [{ text: "OK" }]);
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Wrong password. Please try again.", [{ text: "OK" }]);
      } else {
        Alert.alert("Error", error.message, [{ text: "OK" }]);
      }
    }
  };

  const resetPassword = () => {
    if (email === "") {
      Alert.alert("Error", "Please enter your email address.", [{ text: "OK" }]);
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Success", "Password reset email sent.", [{ text: "OK" }]);
      })
      .catch((error) => {
        Alert.alert("Error", error.message, [{ text: "OK" }]);
      });
  };

  const toggleRememberMe = () => {
    setIsRemembered(!isRemembered);
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication) {
        const { idToken, accessToken } = authentication;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            const user = userCredential.user;
            navigation.replace("MainApp");
          })
          .catch((error) => {
            Alert.alert("Error", error.message, [{ text: "OK" }]);
          });
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <StatusBar />
        <Image source={require("./../assets/sateh.png")} style={tw`h-30 w-30 self-center mt-20`} />
        <View style={tw`items-center`}>
          <Text style={tw`text-2xl font-bold text-gray-700`}>Login dulu kali ah</Text>
          <Text style={tw`text-sm text-gray-700 mt-4`}>Masuk pake akun kamu yang udah didaftarin ya!</Text>
        </View>

        <TextInput
          style={tw`mx-12 mt-2 p-2 border border-gray-400 rounded-lg`}
          value={email}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <View style={tw`flex-row items-center mx-12 mt-2 p-2 border border-gray-400 rounded-lg`}>
          <TextInput
            style={tw`flex-1`}
            value={password}
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={tw`ml-2 justify-center`}>
            <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={20} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row justify-between mx-12 mt-2`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={toggleRememberMe}>
              <Ionicons name={isRemembered ? "checkbox" : "checkbox-outline"} size={16} color="#5CB85C" />
            </TouchableOpacity>
            <Text style={tw`ml-2 text-xs text-gray-600`}>Ingatin Akunku</Text>
          </View>
          <TouchableOpacity onPress={resetPassword}>
            <Text style={tw`text-xs text-blue-600`}>Lupa Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={tw`bg-[#5CB85C] h-10 mx-12 mt-8 rounded-xl justify-center items-center shadow-lg`} onPress={login}>
          <Text style={tw`text-white text-sm`}>Masuk</Text>
        </TouchableOpacity>
        
        <View style={tw`flex-row justify-center mt-2`}>
          <Text style={tw`text-xs`}>Belum punya akun? </Text>
          <Text style={tw`text-xs text-blue-600`} onPress={() => navigation.navigate("signup")}>Daftar</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
