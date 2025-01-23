import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

export default function Start() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar />
      <ScrollView >
              <View style={tw`flex-1  justify-center items-center `}>
                <Image source={require('../assets/StartPage/sateh.png')} style={tw`w-80 h-80 mt-12 `}/>
                <Text style={tw`text-3xl font-bold text-neutral-700 mx-16 text-center`}>
                Pet Cepet, Sen Pesen!
                </Text>
                <Text style={tw`text-base text-neutral-500 p-2 mx-16 text-center`}>
               Pengantaran ke rumah, dan reservasi online untuk sate cak awih!
                </Text>
              </View>
              <View style={tw`flex-1 justify-end items-center mt-4`}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MainApp')}
                  style={tw`bg-[#5CB85C] px-16 py-2 shadow-md rounded-lg`}
                >
                  <Text style={tw`text-neutral-100 text-sm`}>Pesan Sekarang!</Text>
                </TouchableOpacity>
                <Text style={tw`text-neutral-700 text-sm mt-2`}>Sudah punya akun? <Text style={tw`text-blue-600 text-sm underline`} onPress={() => navigation.navigate('signin')}>Masuk</Text></Text>
              </View>
      </ScrollView>
    </SafeAreaView>
  );
}

