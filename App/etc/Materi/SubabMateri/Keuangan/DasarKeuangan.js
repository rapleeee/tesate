import { Pressable, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons'; // Menggunakan Ionicons untuk icon kembali

// Data materi keuangan
const reactMateriKeuangan = [
  {
    Judul: "Pendahuluan Laporan Keuangan",
    subJudul: "Memahami dasar-dasar laporan keuangan dan tujuannya dalam bisnis.",
    Poin: [
      "Laporan keuangan mencakup laporan laba rugi, neraca, dan arus kas.",
      "Menyediakan informasi tentang kondisi keuangan perusahaan.",
      "Penting bagi pemegang saham, investor, dan manajemen perusahaan."
    ],
  },
  {
    Judul: "Laporan Laba Rugi",
    subJudul: "Cara menyusun dan memahami laporan laba rugi.",
    Poin: [
      "Laporan laba rugi menunjukkan pendapatan dan beban selama periode tertentu.",
      "Berfungsi untuk mengetahui apakah perusahaan untung atau rugi.",
      "Komponen utama: Pendapatan, Beban, Laba Bersih."
    ],
  },
  {
    Judul: "Neraca Keuangan",
    subJudul: "Membahas struktur neraca keuangan dan kegunaannya.",
    Poin: [
      "Neraca berisi informasi tentang aset, kewajiban, dan ekuitas perusahaan.",
      "Berguna untuk memahami posisi keuangan pada suatu waktu tertentu.",
      "Komponen utama: Aset, Liabilitas, dan Ekuitas."
    ],
  }
];

const DasarKeuangan = ({ navigation }) => {
  const [currentMateriIndex, setCurrentMateriIndex] = useState(0);

  const handleNext = () => {
    if (currentMateriIndex === reactMateriKeuangan.length - 1) {
      navigation.navigate('kuisLaporanKeuangan');
    } else {
      setCurrentMateriIndex(currentMateriIndex + 1);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header dengan Icon Back */}
      <View style={tw`flex-row items-center mt-4 px-4`}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={tw`text-lg font-bold ml-2`}>Lesson 3</Text>
      </View>

      <View style={tw`p-6`}>
        {/* Judul Besar */}
        <Text style={tw`text-xl font-extrabold text-[#BB1624] mb-6`}>
          Dasar Laporan Keuangan
        </Text>

        {/* Konten Materi */}
        <Text style={tw`text-base font-bold mb-4`}>
          {reactMateriKeuangan[currentMateriIndex].Judul}
        </Text>
        <Text style={tw`text-gray-600 mb-6`}>
          {reactMateriKeuangan[currentMateriIndex].subJudul}
        </Text>

        {/* List Poin Materi */}
        {reactMateriKeuangan[currentMateriIndex].Poin.map((poin, index) => (
          <View key={index} style={tw`flex-row items-start mb-4`}>
            <View style={tw`h-4 w-4 rounded-full bg-gray-300 mt-1 mr-2`} />
            <Text style={tw`flex-1 text-gray-600`}>{poin}</Text>
          </View>
        ))}

        {/* Tombol Next */}
        <Pressable
          style={tw`bg-gray-700 p-4 rounded-full items-center mt-6`}
          onPress={handleNext}
        >
          <Text style={tw`text-white text-base`}>
            {currentMateriIndex === reactMateriKeuangan.length - 1
              ? 'Finish'
              : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default DasarKeuangan;
