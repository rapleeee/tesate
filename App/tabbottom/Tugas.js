import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // Untuk navigasi back
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons'; // Menggunakan ikon back dari Ionicons

const Tugas = () => {
  const navigation = useNavigation(); // Hook untuk navigasi back

  return (
    <SafeAreaView style={tw`bg-white`}>
      <ScrollView>
        
        

        <View style={tw`relative mt-4`}>
        
          <Image
            source={require('./../assets/AkunPage/Promotion.png')} // Sesuaikan dengan path gambar Promotion
            style={tw`w-full h-50 mb-15`}
            resizeMode="stretch"
          />
         <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <Icon name="chevron-back" size={30} color="#000" />
          </TouchableOpacity>
          <View style={tw`absolute w-full items-center top-10`}>
            <Text style={tw`text-white text-lg`}>Current Coins</Text>
            <Text style={tw`text-white text-4xl font-bold mt-2`}>200</Text>
            <Image
              source={require('./../assets/tugasPage/coin.png')}
              style={tw`w-10 h-10 mt-2`}
            />
            <TouchableOpacity style={tw`bg-yellow-400 rounded-full py-2 px-4 mt-4`}>
              <Text style={tw`text-yellow-900 font-bold`}>Ambassador Elite</Text>
            </TouchableOpacity>
            <Text style={tw`text-black mt-2`}>Ikuti tantangan dan dapatkan hadiahnya!</Text>
          </View>
        </View>

        {/* Task Sections */}
        <View  style={tw`flex-1 p-4`}>
          {/* Daily Task */}
          <View style={tw`bg-gray-200 p-4 rounded-lg flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>Daily Task</Text>
              <Text style={tw`ml-2 text-blue-600`}>XP 50</Text>
              <Image
                source={require('./../assets/tugasPage/coin.png')}
                style={tw`ml-2 w-6 h-6`}
              />
            </View>
            <Text style={tw`text-lg text-green-500`}>Done</Text>
          </View>

          {/* Weekly Task */}
          <View style={tw`bg-gray-200 p-4 rounded-lg flex-row justify-between items-center mt-4`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>Weekly Task</Text>
              <Text style={tw`ml-2 text-blue-600`}>XP 125</Text>
              <Image
                source={require('./../assets/tugasPage/coin.png')}
                style={tw`ml-2 w-6 h-6`}
              />
            </View>
            <TouchableOpacity style={tw`bg-red-600 rounded-full py-2 px-4`}>
              <Text style={tw`text-white text-lg`}>Start</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={tw`bg-gray-300 h-2 mt-2 rounded-full`}>
            <View style={tw`bg-red-600 h-full w-2/3 rounded-full`}></View>
          </View>
          <View style={tw`mt-6`}>
          {/* New Year Event */}
          <View style={tw`bg-blue-100 p-4 rounded-lg flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>New Year</Text>
              <Text style={tw`ml-2 text-green-500`}>25</Text>
              <Image
                source={require('./../assets/tugasPage/coin.png')}
                style={tw`ml-2 w-6 h-6`}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={tw`bg-gray-300 h-2 mt-2 rounded-full`}>
            <View style={tw`bg-blue-600 h-full w-1/6 rounded-full`}></View>
          </View>

          {/* Ambassador Elite Event */}
          <View style={tw`bg-yellow-200 p-4 rounded-lg flex-row justify-between items-center mt-4`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>Ambassador Elite</Text>
              <Text style={tw`ml-2 text-green-500`}>1000</Text>
              <Image
                source={require('./../assets/tugasPage/coin.png')}
                style={tw`ml-2 w-6 h-6`}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={tw`bg-gray-300 h-2 mt-2 rounded-full`}>
            <View style={tw`bg-yellow-600 h-full w-1/12 rounded-full`}></View>
          </View>
        </View>
        </View>

        {/* Special Event Sections */}
        

      </ScrollView>
    </SafeAreaView>
  );
};

export default Tugas;
