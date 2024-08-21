import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase'; // Pastikan db diimpor untuk Firestore
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore'; // Impor Firestore methods

export default function Singin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

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
      }
      if (authUser) {
        navigation.replace("MainApp");
      }
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  const login = async () => {
    if (email === "" || password === "") {
      Alert.alert(
        "Yakin mau login?",
        "Kamu udah masukin Email apa Passwordnya?",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("user details", user);

      // Fetch user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Check user role and navigate accordingly
        if (userRole === "admin") {
          navigation.replace("adminPanel"); // Replace with your admin dashboard route
        } else if (userRole === "user") {
          navigation.replace("MainApp");
        } else {
          console.log("Unknown user role:", userRole);
        }
      } else {
        console.log("No such document!");
        Alert.alert("Error", "User data not found.");
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView>
        <StatusBar />
        <Image source={require('./../assets/SignIn.png')} style={{ resizeMode: "cover", height: 300, width: 340, marginLeft:24 }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.h1}>Let's Sign In</Text>
          <Text style={styles.h2}>Hi! Welcome back Buddy, you've been missed</Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            marginHorizontal: 65,
            marginTop: 20,
            marginBottom: -45,
            fontWeight: "bold",
          }}
        >
          Email
        </Text>
        <TextInput
          style={styles.input1}
          value={email}
          placeholder="Your email address"
          onChangeText={(text) => setEmail(text)}
          autoFocus
        />
        <Text
          style={{
            fontSize: 13,
            marginHorizontal: 65,
            marginTop: 2,
            marginBottom: -20,
            fontWeight: "bold",
          }}
        >
          Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input2}
            value={password}
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
            <Ionicons
              name={secureTextEntry ? 'eye-off' : 'eye'}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={login}
        >
          <Text style={{ color: "#ffff" }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetPassword} style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View
          style={{ flexDirection: "row", marginTop: 5, marginHorizontal: 111 }}
        >
          <Text>Don't have an Account? </Text>
          <Text
            style={{ textDecorationLine: "underline", color: "blue" }}
            onPress={() => navigation.navigate("signup")}
          >
            Sign Up
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  h1: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 35,
    color: '#2F0909',
  },
  h2: {
    marginTop: 1,
    textAlign: 'center',
    fontSize: 15,
    color: 'grey'
  },
  texthead: {
    fontSize: 30,
    marginTop: 35,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  othertext: {
    textAlign: 'center',
    color: 'grey'
  },
  button: {
    backgroundColor: '#BF3131',
    padding: 10,
    marginTop: 30,
    marginHorizontal: 65,
    display: 'flex',
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  input1: {
    marginHorizontal: 65,
    marginTop: 50,
    width: '70%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
  },
  input2: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 65,
    marginTop: 25,
    width: '70%',
  },
  forgotButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
