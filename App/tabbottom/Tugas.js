import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

export default function Tugas() {
  const [materials, setMaterials] = useState([]);
  const navigation = useNavigation();
  const [isChecked, setChecked] = useState({});

  useEffect(() => {
    const fetchMaterials = async () => {
      const querySnapshot = await getDocs(collection(db, 'materials'));
      const materialsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterials(materialsList);
    };

    const loadCheckedState = async () => {
      try {
        const savedCheckedState = await AsyncStorage.getItem('checkedState');
        if (savedCheckedState) {
          setChecked(JSON.parse(savedCheckedState));
        }
      } catch (e) {
        console.error('Failed to load checkbox state.', e);
      }
    };

    fetchMaterials();
    loadCheckedState();
  }, []);

  const handleCheckboxPress = async (id) => {
    const updatedCheckedState = {
      ...isChecked,
      [id]: !isChecked[id],
    };
    setChecked(updatedCheckedState);

    try {
      await AsyncStorage.setItem('checkedState', JSON.stringify(updatedCheckedState));
    } catch (e) {
      console.error('Failed to save checkbox state.', e);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <StatusBar />
        <View style={tw`p-5`}>
          <Image
            source={require("./../assets/Logo.png")}
            style={tw`h-8 w-8 mb-5`}
          />
        </View>
        <View style={tw`px-5 mb-5`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-lg text-red-700 font-medium`}>Program Kredit Usaha</Text>
            <AntDesign
              name="exclamationcircleo"
              size={17}
              color="#7D0A0A"
              onPress={() => navigation.navigate("edu")}
            />
          </View>
          <Text style={tw`text-base text-gray-800 font-light mt-2`}>
            Yuk selesaiin materi edukasinya biar makin pinter!
          </Text>
        </View>
        
        {/* Existing materials */}
        {[
          { id: 1, title: 'Materi Laporan Keuangan', route: 'Keuangan' },
          { id: 2, title: 'Sosial Media Branding', route: 'sosmed' },
          { id: 3, title: 'Ads/Iklan', route: 'ads' },
        ].map(material => (
          <View key={material.id} style={tw`flex-row items-center justify-between p-4 bg-white mx-5 mb-4 rounded-lg border border-gray-300`}>
            <Text style={tw`text-gray-700`} onPress={() => navigation.navigate(material.route)}>
              {material.title}
            </Text>
            <TouchableOpacity onPress={() => handleCheckboxPress(material.id)}>
              <AntDesign
                name={isChecked[material.id] ? "checksquare" : "checksquareo"}
                size={22}
                color="#7d0a0a"
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* New materials from Firestore */}
        {materials.map(material => (
          <View key={material.id} style={tw`flex-row items-center justify-between p-4 bg-white mx-5 mb-4 rounded-lg border border-gray-300`}>
            <Text style={tw`text-gray-700`} onPress={() => navigation.navigate("detailMateri", { material })}>
              {material.title}
            </Text>
            <TouchableOpacity onPress={() => handleCheckboxPress(material.id)}>
              <AntDesign
                name={isChecked[material.id] ? "checksquare" : "checksquareo"}
                size={22}
                color="#7d0a0a"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
