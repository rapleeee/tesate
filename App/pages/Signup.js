import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Pressable, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };


  const register = async () => {
    if (fullname === "" || email === "" || password === "" || phoneNumber === "") {
      Alert.alert(
        "Invalid Details",
        "Please fill all the details",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    } else {
      if (password.length < 6) {
        Alert.alert(
          "Invalid Password",
          "Password should be at least 6 characters long",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const myUserUid = user.uid;

          await setDoc(doc(db, "users", myUserUid), {
            fullname: fullname,
            email: email,
            phoneNumber: phoneNumber,
            scores: {},
            role: 'user'
          });

          console.log("User data saved successfully");
          navigation.replace("MainApp");
        } catch (error) {
          Alert.alert("Registration Failed", error.message);
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView>
        <StatusBar />
        <KeyboardAvoidingView>
          <Image source={require('./../assets/signup.png')} style={{ resizeMode: 'cover', height: 250, width: 340, marginLeft:30 }} />
          <View>
            <Text style={styles.h1}>Create New Account</Text>
            <Text style={styles.h2}>Hi Buddy!! Fill Your Details</Text>
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
            Fullname
          </Text>
          <TextInput
            style={styles.input1}
            placeholder="Gloria Mairani"
            onChangeText={(text) => setFullname(text)} autoFocus
          />
          <Text
            style={{
              fontSize: 13,
              marginHorizontal: 65,
              marginTop: 2,
              marginBottom: -45,
              fontWeight: "bold",
            }}
          >
            Email
          </Text>
          <TextInput
            style={styles.input1}
            placeholder="example@gmail.com"
            onChangeText={(text) => setEmail(text)}
          />
          <Text
            style={{
              fontSize: 13,
              marginHorizontal: 65,
              marginTop: 2,
              marginBottom: -45,
              fontWeight: "bold",
            }}
          >
            Phone Number
          </Text>
          <TextInput
            style={styles.input1}
            placeholder="+62821808080"
            onChangeText={(text) => setPhoneNumber(text)}
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
            placeholder="*******"
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
          <Pressable
            style={styles.button}
            onPress={register}
          >
            <Text style={{ color: "#ffff" }}>Sign Up</Text>
          </Pressable>
          <View style={{ flexDirection: "row", marginTop: 5, marginHorizontal: 111 }}>
            <Text>Already Have Account?</Text>
            <Text style={{ textDecorationLine: "underline", color: "blue" }}
              onPress={() => navigation.navigate("signin")}>Sign In</Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signup;

const styles = StyleSheet.create({
  h1: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: '#2F0909',
  },
  h2: {
    marginTop: 1,
    textAlign: 'center',
    fontSize: 15,
    color: 'grey'
  },
  button: {
    backgroundColor: '#BF3131',
    padding: 12,
    marginTop: 130,
    marginHorizontal: 70,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  othertext: {
    textAlign: 'center',
    color: 'grey'
  },
  button: {
    backgroundColor: '#BF3131',
    padding: 10,
    marginTop: 20,
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
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 0
  },
  input2: {
    marginHorizontal: 65,
    marginTop: 25,
    width: '70%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
  },
  icon: {
    marginLeft: -35,
    justifyContent: 'center',
    marginTop: 10
  },
  passwordContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // marginHorizontal: 65,
    marginTop: 1,
    width: '80%',
  },
});
