import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function Start() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <Image source={require("./../assets/StartPage/card.png")} />
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1.3,
          shadowRadius: 4.65,
          elevation: 4,
          width: "40%",
          height: 100,
          marginLeft: 120,
          marginTop: -50,
          backgroundColor: "transparent", // Pastikan background transparan
        }}
      >
        <Image
          source={require("./../assets/LoginPage/Logo-Saraya-New.png")}
          style={{
            resizeMode: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </View>
      <Image
        style={styles.image2}
        source={require("./../assets/LoginPage/LogoFont.png")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.h2}>Master Finance, Earn Rewards, </Text>
      </View>
      <Text style={styles.h1}>Grow Faster!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("signup")}
      >
        <Text style={styles.buttonText}>Let's Get Started</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Already Have Account?</Text>
        <Text
          style={styles.signInText}
          onPress={() => navigation.navigate("signin")}
        >
          Sign In
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  image: {
    resizeMode: 'center',
    width: '40%',
    height: 100,
    marginLeft: 120,
    marginTop: -50,
  },
  image2: {
    resizeMode: 'center',
    width: '30%',
    height: 100,
    marginLeft: 145,
    marginTop: 5,
  },
  textContainer: {
    marginTop: -5,
    alignItems: 'center',
    marginVertical: 20,
  },
  h1: {
    textAlign: 'center',
    marginTop:-15,
    fontSize: 15,
    color: '#292828',
  },
  h2: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 15,
    color: '#292828',
  },
 button: {
  backgroundColor: '#BB1624',
  padding: 10,
  marginTop: 80,
  marginHorizontal: 70,
  alignItems: 'center',
  borderRadius: 30,

  // Properti bayangan
  shadowColor: '#000', // Warna bayangan
  shadowOffset: { width: 0, height: 2 }, // Posisi bayangan
  shadowOpacity: 1, // Opasitas bayangan
  shadowRadius: 6, // Radius bayangan
  elevation: 4, // Khusus Android
},

  buttonText: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  signInText: {
    marginHorizontal: 3,
    textDecorationLine: 'underline',
    color: 'blue',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBox: {
    position: 'absolute',
    width: 416,
    height: 358,
    left: 0,
    top: 0,
    borderBottomLeftRadius: 179,
  },
});
