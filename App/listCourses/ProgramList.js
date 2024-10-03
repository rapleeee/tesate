import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function ProgramList() {
  const [selectedCategory, setSelectedCategory] = useState("All"); // State untuk kategori yang dipilih
  const navigation = useNavigation();

  const programs = [
    { id: 1, category: "Keuangan Bisnis", title: "Introduction of Financial Statement I", modules: "4 Module", type: "Free", rating: "4.5 (1000)", targetPage: 'keuanganProgram' },
    { id: 2, category: "Investasi Usaha", title: "Introduction of Venture Capital", modules: "4 Module", type: "Pro", rating: "4.5 (823)", targetPage: 'investasiProgram' },
    { id: 3, category: "Branding", title: "Importance of Branding", modules: "5 Module", type: "Pro", rating: "4.5 (28763)", targetPage: 'BrandingDetail' },
    { id: 4, category: "Marketing", title: "How to Use Sales Promotion", modules: "5 Module", type: "Pro", rating: "4.5 (150)", targetPage: 'MarketingDetail' },
    { id: 5, category: "Keuangan Bisnis", title: "Introduction of Financial Statement II", modules: "4 Module", type: "Pro", rating: "4.5 (7892)", targetPage: 'KeuanganDetail2' },
    { id: 6, category: "Keuangan Bisnis", title: "Introduction of Financial Statement III", modules: "4 Module", type: "Pro", rating: "4.5 (7892)", targetPage: 'KeuanganDetail2' },
    { id: 7, category: "Keuangan Pribadi", title: "Personal Finance Management", modules: "4 Module", type: "Pro", rating: "4.5 (254)", targetPage: 'KeuanganPribadiDetail' },
  ];

  const handleCategoryPress = (category) => {
    setSelectedCategory(category); // Mengatur kategori yang dipilih
  };


  const handleProgramPress = (program) => {
    navigation.navigate(program.targetPage, { program }); // Navigasi ke halaman yang dinamis
  };

  // Filter program berdasarkan kategori yang dipilih
  const filteredPrograms = selectedCategory === "All" 
    ? programs 
    : programs.filter(program => program.category === selectedCategory);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar />
      <ScrollView>
        {/* Header */}
        <View style={tw`flex-row items-center py-3 px-5`}>
          <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.navigate("MainApp")} />
          <Text style={tw`text-lg font-bold ml-4`}>Program Saya</Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`border-b border-gray-200 px-5 py-3`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => handleCategoryPress("All")}>
              <Text style={selectedCategory === "All" ? tw`text-red-500 font-bold mr-5` : tw`text-gray-500 mr-5`}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategoryPress("Keuangan Bisnis")}>
              <Text style={selectedCategory === "Keuangan Bisnis" ? tw`text-red-500 font-bold mr-5` : tw`text-gray-500 mr-5`}>Keuangan Bisnis</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategoryPress("Keuangan Pribadi")}>
              <Text style={selectedCategory === "Keuangan Pribadi" ? tw`text-red-500 font-bold mr-5` : tw`text-gray-500 mr-5`}>Keuangan Pribadi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategoryPress("Pengembangan Usaha")}>
              <Text style={selectedCategory === "Pengembangan Usaha" ? tw`text-red-500 font-bold mr-5` : tw`text-gray-500 mr-5`}>Pengembangan Usaha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Program List */}
        <View style={tw`px-5 py-4`}>
          <Text style={tw`font-bold text-lg mb-4`}>Recent Upload</Text>
          {filteredPrograms.map((program) => (
            <TouchableOpacity key={program.id} onPress={() => handleProgramPress(program)}>
              <View style={tw`flex-row mb-5 border rounded-lg p-3 border-gray-300`}>
                {/* Placeholder Image */}
                <View style={tw`bg-gray-200 rounded-lg w-20 h-20 mr-3`}></View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-500 text-xs`}>{program.category}</Text>
                  <Text style={tw`text-black font-semibold`}>{program.title}</Text>
                  <Text style={tw`text-gray-500 text-xs`}>{program.modules}</Text>
                  <View style={tw`flex-row items-center mt-2`}>
                    <View style={tw`${program.type === "Free" ? 'bg-red-200' : 'bg-yellow-200'} px-2 py-1 rounded-full`}>
                      <Text style={tw`${program.type === "Free" ? 'text-red-600' : 'text-yellow-600'} text-xs`}>{program.type}</Text>
                    </View>
                    <Text style={tw`text-gray-500 ml-3 text-xs`}>
                      <AntDesign name="star" size={12} color="#F5A623" /> {program.rating}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
