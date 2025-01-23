import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, Pressable, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Ionicons } from "react-native-vector-icons";
import tw from "twrnc";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const register = async () => {
    if (fullname === "" || email === "" || password === "" || phoneNumber === "") {
      Alert.alert("Invalid Details", "Please fill all the details");
    } else {
      if (password.length < 6) {
        Alert.alert(
          "Invalid Password",
          "Password should be at least 6 characters long"
        );
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          const myUserUid = user.uid;
  
          // Menyimpan data pengguna baru ke Firestore dengan status survei dan modul awal
          await setDoc(doc(db, "users", myUserUid), {
            fullname: fullname,
            email: email,
            phoneNumber: phoneNumber,
            scores: {},
            role: "user",
            hasCompletedSurvey: false, // Tambahkan status survei bisnis
            coursesJoined: [1], // Otomatis tambahkan modul "Dasar Keuangan Bisnis" (ID = 1)
            createdAt: new Date().toISOString(),
          });
  
          console.log("User data saved successfully");
  
          // Periksa apakah pengguna sudah menyelesaikan survei bisnis
          const userDocRef = doc(db, "users", myUserUid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().hasCompletedSurvey === false) {
            // Jika belum, arahkan ke halaman survei bisnis
            navigation.replace("bisnisSurvey");
          } else {
            // Jika sudah, arahkan ke halaman utama aplikasi
            navigation.replace("MainApp");
          }
        } catch (error) {
          Alert.alert("Registration Failed", error.message);
        }
      }
    }
  };
  


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        <StatusBar />
        <KeyboardAvoidingView style={tw`flex-1`}>
          <View style={tw`flex-1`}>
            <Image
              source={require("./../assets/sateh.png")}
              style={tw`h-30 w-30 self-center `}
            />
            <View style={tw`flex-col items-center justify-center mx-12`}>
              <Text style={tw`text-center font-bold text-2xl text-gray-700 mb-2`}>
                Daftar Dulu
              </Text>
              <Text style={tw`text-sm text-center text-gray-700 mb-8`}>
                 Daftarin akun kamu disini, isi yang lengkap ya data yang aku minta, jangan sampe ngga!
              </Text>
            </View>


            <TextInput
              style={tw`mx-12 mt-1 mb-2 p-2 border border-gray-400 rounded-lg`}
              placeholder="Nama Lengkap"
              placeholderTextColor={"darkgrey"}
              onChangeText={(text) => setFullname(text)}
              autoFocus
            />

            <TextInput
              style={tw`mx-12 mt-1 mb-2 p-2 border border-gray-400 rounded-lg`}
              placeholder="Alamat Email"
              placeholderTextColor={"darkgrey"}
              onChangeText={(text) => setEmail(text)}
            />

            <TextInput
              style={tw`mx-12 mt-1 mb-2 p-2 border border-gray-400 rounded-lg`}
              placeholder="Nomor Handphone"
              placeholderTextColor={"darkgrey"}
              onChangeText={(text) => setPhoneNumber(text)}
            />

            <View
              style={tw`flex-row mx-12 mt-1 mb-2 p-2 border border-gray-400 rounded-lg`}
            >
              <TextInput
                style={tw`flex-1`}
                placeholder="Password"
                placeholderTextColor={"darkgrey"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={tw`self-center`}
              >
                <Ionicons
                  name={secureTextEntry ? "eye-off" : "eye"}
                  size={20}
                  color="darkgrey"
                />
              </TouchableOpacity>
            </View>

            <Pressable
              style={tw`bg-[#5CB85C] p-3 mx-12 my-2 rounded-xl shadow-lg`}
              onPress={register}
            >
              <Text style={tw`text-white text-center text-sm`}>Daftar</Text>
            </Pressable>

            

            <View style={tw`flex-row justify-center `}>
              <Text style={tw`text-xs`}>Sudah punya akun?</Text>
              <Text
                style={tw`text-blue-700 ml-1 text-xs`}
                onPress={() => navigation.navigate("signin")}
              >
                Masuk
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
