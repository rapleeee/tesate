import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { db } from '../../firebase'; // Import Firebase setup
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { auth } from '../../firebase'; // Firebase Auth (jika kamu pakai Authentication)
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Roadmap = () => {
  // Status modul dinamis: 'completed', 'in-progress', atau 'locked'
  const [modules, setModules] = useState([
    { id: 1, title: 'Memahami Dasar-dasar Keuangan', status: 'completed', route: 'dasarKeuangan' },
    { id: 2, title: 'Mengenal Alat-alat Keuangan', status: 'in-progress', route: 'dasarKeuangan' },
    { id: 3, title: 'Mengelola Pemasukan dan Pengeluaran', status: 'locked', route: 'dasarKeuangan' },
    { id: 4, title: 'Menyiapkan Anggaran', status: 'locked', route: 'dasarKeuangan' },
  ]);

  // State untuk menyimpan XP dan Coins pengguna
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);

  // Dapatkan userId dari Firebase Auth
  const [userId, setUserId] = useState(null);

  // Dapatkan navigasi dari useNavigation
  const navigation = useNavigation();

  useEffect(() => {
    // Pastikan userId dari Firebase Auth
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Set userId dari Authentication
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // Fungsi untuk mengambil data pengguna dari Firestore
      const fetchUserData = async () => {
        try {
          const userRef = doc(db, 'users', userId); // Referensi ke dokumen user berdasarkan userId
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log('User data:', userData); // Log untuk memeriksa data yang diambil
            setXp(userData.xp || 0); // Set XP dari data pengguna
            setCoins(userData.coins || 0); // Set Coins dari data pengguna
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      };

      fetchUserData(); // Panggil fungsi untuk mengambil data
    }
  }, [userId]);

  const renderModuleIcon = (status) => {
    if (status === 'completed') {
      return (
        <Image source={require('./../assets/roadMap/check-icon.png')} style={tw`w-14 h-15`} />
      );
    }
    if (status === 'in-progress') {
      return (
        <Image source={require('./../assets/roadMap/book-icon.png')} style={tw`w-14 h-15`} />
      );
    }
    return (
      <Image source={require('./../assets/roadMap/lock-icon.png')} style={tw`w-14 h-15`} />
    );
  };

  const handleModulePress = (module) => {
    if (module.status !== 'locked') {
      navigation.navigate(module.route); // Navigasi ke halaman sesuai dengan module.route
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View style={tw`relative`}>
        {/* Header background */}
        <Image
          source={require('./../assets/AkunPage/Promotion2.png')}
          style={tw`w-full h-40 mb-15`}
          resizeMode="stretch"
        />

        {/* XP and Coins */}
        <View style={tw`absolute w-full justify-center gap-10 flex-row top-10`}>
          <View style={tw`flex-row items-center gap-2`}>
            <Image source={require('./../assets/homePage/XP.png')} />
            <Text style={tw`text-white text-base`}>{xp}</Text>
          </View>
          <View style={tw`flex-row items-center gap-2`}>
            <Image source={require('./../assets/homePage/coins.png')} />
            <Text style={tw`text-white text-base`}> {coins}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={tw`absolute w-full border-b-2 border-gray-400 my-25`} />

        {/* Title */}
        <View style={tw`absolute justify-center items-center w-full`}>
          <Text style={tw`mt-27 text-white text-base`}>Foundation Level</Text>
          <Text style={tw`text-white text-xs`}>10 Modul</Text>
        </View>

        {/* Card for first module */}
        <View style={tw`justify-center items-center mt-[-45]`}>
          <Image source={require('./../assets/roadMap/card.png')} style={tw`w-80 h-18`} />
        </View>

        {/* Roadmap Section */}
        <View style={tw`mt-12 px-9`}>
          {modules.map((module, index) => (
            <View key={module.id} style={tw`mb-8 justify-center items-center`}>
              
              <TouchableOpacity
                style={tw`justify-center items-center`}
                disabled={module.status === 'locked'} // Disable button for locked modules
                onPress={() => handleModulePress(module)} // Navigasi ke halaman lain saat ikon diklik
              >
                {renderModuleIcon(module.status)}
              </TouchableOpacity>

            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Roadmap;
