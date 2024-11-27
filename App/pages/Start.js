import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export default function Start() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar />
      <ScrollView >
            <ImageBackground source={require('../assets/StartPage/card.png')} style={tw`w-full h-90`}>
            </ImageBackground>
              <View style={tw`flex-1  justify-start items-center `}>
                <Image source={require('../assets/StartPage/logo.png')} style={tw`w-35 h-35 mt--15`}/>
                <Text style={tw`text-base p-4 mx-16 mt-2 text-center`}>
                Master Finance, Earn Rewards, Grow Faster!
                </Text>
              </View>
              <View style={tw`flex-1 justify-end items-center mt-15`}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('signup')}
                  style={tw`bg-[#BB1624] px-16 py-2 rounded-full `}
                >
                  <Text style={tw`text-white text-sm`}>Mulai Sekarang!</Text>
                </TouchableOpacity>
                <Text>Sudah punya akun? <Text style={tw`text-[#BB1624] text-sm underline`} onPress={() => navigation.navigate('signin')}>Masuk</Text></Text>
              </View>
      </ScrollView>
    </SafeAreaView>
  );
}

