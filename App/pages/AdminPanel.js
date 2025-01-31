import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  ScrollView,
  StatusBar,
} from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Text from '../Shared/Text';

export default function AdminPanel({ navigation }) {
  const [category, setCategory] = useState('Makanan'); // Current category
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', stock: '', cookingTime: '', image: '' });

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, category));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.stock || !form.cookingTime || !form.image) {
      Alert.alert('Error', 'All fields must be filled.');
      return;
    }

    try {
      await addDoc(collection(db, category), form);
      Alert.alert('Success', 'Item added successfully');
      setForm({ name: '', stock: '', cookingTime: '', image: '', price: '', description: '', category: '' });
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, category, id));
      Alert.alert('Success', 'Item deleted successfully');
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('signin');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={tw`bg-white rounded-xl shadow-lg mb-4 w-[48%] mx-[1%] mt-4 p-2 h-52 `}>
      <Image source={{ uri: item.image }} style={tw`w-16 h-16 rounded`} />
      <View style={tw`flex-1 mt-2`}>
        <Text style={tw`font-bold text-lg`}>{item.name}</Text>
        <Text>Stock: {item.stock}</Text>
        <Text>Cooking Time: {item.cookingTime} min</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={tw`bg-red-500 px-4 py-2 rounded mt-2`}>
        <Text style={tw`text-white text-center`}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ListHeaderComponent={
          <View style={tw`p-4`}>
            <Text style={tw`text-xl text-neutral-800 font-bold mb-4`}>Halo, Cak Awih!</Text>

            <View style={tw`flex-row justify-between mb-4`}>
              {['Makanan', 'Minuman', 'Snacks'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={tw`px-4 border border-gray-400 py-2 rounded-lg ${category === cat ? 'bg-[#5CB85C]' : 'bg-[#5CB85C] opacity-50'}`}
                >
                  <Text style={tw`${category === cat ? 'text-white' : 'text-black'}`}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Nama Makanan/Minuman/Snacks"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              style={tw`border border-gray-300 bg-neutral-200 p-2 mb-2 rounded-lg`}
            />
            <TextInput
              placeholder="Harga"
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })} // Benar: Mengupdate form.price
              style={tw`border border-gray-300 bg-neutral-200 p-2 mb-2 rounded-lg`}
            />

            <TextInput
              placeholder="Jumlah Stok"
              value={form.stock}
              onChangeText={(text) => setForm({ ...form, stock: text })}
              style={tw`border border-gray-300 bg-neutral-200 p-2 mb-2 rounded-lg`}
            />
            <TextInput
              placeholder="Waktu Perkiraan Masak (min)"
              value={form.cookingTime}
              onChangeText={(text) => setForm({ ...form, cookingTime: text })}
              style={tw`border border-gray-300 bg-neutral-200 p-2 mb-2 rounded-lg`}
            />
            <TouchableOpacity onPress={pickImage} style={tw`bg-neutral-200 p-2 mb-4 border border-gray-300 roundedlg flex-row items-center`}>
              <MaterialIcons name="image" size={20} color="gray" style={tw`mr-2`} />
              <Text>Pick Image</Text>
            </TouchableOpacity>
            {form.image ? <Image source={{ uri: form.image }} style={tw`w-24 h-24 mb-4`} /> : null}
            <TouchableOpacity onPress={handleAdd} style={tw`bg-[#5CB85C] p-4 rounded-lg`}>
              <Text style={tw`text-white text-center`}>Masukin Menu!</Text>
            </TouchableOpacity>

            <Text style={tw`text-xl font-bold mt-6 mb-4`}>Daftar Menu</Text>
          </View>
              }
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
  columnWrapperStyle={tw`justify-between`}
              ListFooterComponent={
          <View style={tw`p-4`}>
            <Text style={tw`text-xl font-bold mt-6 mb-4`}>Order Monitoring</Text>
            <View style={tw`p-4 bg-white rounded-lg shadow-md`}>
              <Text style={tw`text-center text-gray-500`}>No orders yet.</Text>
            </View>

            <TouchableOpacity onPress={handleLogout} style={tw`bg-red-500 p-4 mt-4 rounded`}>
              <View style={tw`flex-row justify-center items-center`}>
                <FontAwesome name="sign-out" size={20} color="white" style={tw`mr-2`} />
                <Text style={tw`text-white text-center`}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>

  );
}