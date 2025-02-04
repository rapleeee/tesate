import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../firebase";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Text from "../Shared/Text";

export default function AdminPanel({ navigation }) {
  const [category, setCategory] = useState("Makanan"); // Current category
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    stock: "",
    cookingTime: "",
    image: "",
  });

  useEffect(() => {
    fetchData();
    fetchOrders();
  }, [category]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, category));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(items);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(items);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const updateOrderStatus = async (id, currentStatus) => {
    let newStatus = "Menunggu Konfirmasi";
    if (currentStatus === "Menunggu Konfirmasi") newStatus = "Sedang Dibuatkan";
    else if (currentStatus === "Sedang Dibuatkan") newStatus = "Diantar";
    
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
      Alert.alert("Success", "Status updated successfully");
      fetchOrders();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.stock || !form.cookingTime || !form.image) {
      Alert.alert("Error", "All fields must be filled.");
      return;
    }

    try {
      await addDoc(collection(db, category), form);
      Alert.alert("Success", "Item added successfully");
      setForm({
        name: "",
        stock: "",
        cookingTime: "",
        image: "",
        price: "",
        description: "",
        category: "",
      });
      fetchData();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, category, id));
      Alert.alert("Success", "Item deleted successfully");
      fetchData();
    } catch (error) {
      Alert.alert("Error", error.message);
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
      navigation.navigate("signin");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };


  const renderOrderItem = ({ item }) => (
    <View style={tw`bg-white rounded-xl shadow-lg p-4 mb-4`}>
      <Text style={tw`font-bold text-lg`}>Pemesan: {item.customerName}</Text>
      <Text>Alamat: {item.address}</Text>
      <Text>Total: Rp {item.totalAmount}</Text>
      <Text>Status: {item.status}</Text>
      <Text style={tw`font-bold mt-2`}>Pesanan:</Text>
      {item.orders.map((order, index) => (
        <Text key={index}>{order.name} - {order.quantity} pcs</Text>
      ))}
      <TouchableOpacity
        onPress={() => updateOrderStatus(item.id, item.status)}
        style={tw`mt-2 p-2 bg-blue-500 rounded-lg`}
      >
        <Text style={tw`text-white text-center`}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );


  const renderItem = ({ item }) => (
    <View
      style={tw`bg-white rounded-xl shadow-lg mb-4 w-[46%] mx-[2%] mt-4 p-4 h-auto `}
    >
      <Image source={{ uri: item.image }} style={tw`w-16 h-16 rounded`} />
      <View style={tw`flex-1 mt-2`}>
        <Text style={tw`font-bold text-lg`}>{item.name}</Text>
        <Text>Stock: {item.stock}</Text>
        <Text>Cooking Time: {item.cookingTime} min</Text>
      </View>
      <View style={tw`flex-row justify-between gap-2 items-center mt-2`}>
        <Text style={tw`font-bold text-[3.8]`}>Rp 15.000</Text>
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={tw`bg-neutral-300 px-2 py-2 rounded-lg`}
          >
            <Ionicons
              name="pencil-outline"
              size={20}
              style={tw`text-red-700`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={tw`bg-red-700 px-3 py-2 rounded-lg`}
          >
            <FontAwesome name="trash-o" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ListHeaderComponent={
          <View style={tw`p-4`}>
            <Text style={tw`text-xl text-neutral-800 font-bold mb-4`}>
              Halo, Cak Awih!
            </Text>

            <View style={tw`flex-row gap-3 mb-4`}>
              {["Makanan", "Minuman", "Snacks"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={tw`px-4 border border-gray-400 py-2 w-28  rounded-lg ${
                    category === cat
                      ? "bg-[#5CB85C]"
                      : "bg-[#5CB85C] opacity-50"
                  }`}
                >
                  <Text
                    style={tw`${
                      category === cat
                        ? "text-white text-center"
                        : "text-black text-center"
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Nama Makanan/Minuman/Snacks"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              style={tw`border border-gray-100 bg-white shadow p-2 mb-2 rounded-lg`}
            />
            <TextInput
              placeholder="Masukkan Harga"
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })} // Benar: Mengupdate form.price
              style={tw`border border-gray-100 bg-white shadow p-2 mb-2 rounded-lg`}
            />

            <TextInput
              placeholder=" Masukkan Jumlah Stok"
              value={form.stock}
              onChangeText={(text) => setForm({ ...form, stock: text })}
              style={tw`border border-gray-100 bg-white shadow p-2 mb-2 rounded-lg`}
            />
            <TextInput
              placeholder="Masukkan Waktu Perkiraan Masak (min)"
              value={form.cookingTime}
              onChangeText={(text) => setForm({ ...form, cookingTime: text })}
              style={tw`border border-gray-100 bg-white shadow p-2 mb-2 rounded-lg`}
            />
            <TouchableOpacity
              onPress={pickImage}
              style={tw`bg-neutral-100 shadow p-2 mb-4 border border-gray-300 rounded-lg flex-row items-center`}
            >
              <MaterialIcons
                name="image"
                size={20}
                color="gray"
                style={tw`mr-2`}
              />
              <Text>Pick Image</Text>
            </TouchableOpacity>
            {form.image ? (
              <Image source={{ uri: form.image }} style={tw`w-24 h-24 mb-4`} />
            ) : null}
            <TouchableOpacity
              onPress={handleAdd}
              style={tw`bg-[#5CB85C] p-4 rounded-lg`}
            >
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
            <View>
              <TouchableOpacity
                style={tw`bg-neutral-800 p-4 rounded-lg shadow-md`}
              >
                <Text style={tw`text-center text-gray-100`}>Lihat Pesanan</Text>
              </TouchableOpacity>
            </View>
            <FlatList
        ListHeaderComponent={
          <View style={tw`p-4`}>
            <Text style={tw`text-xl font-bold mt-6 mb-4`}>Order Monitoring</Text>
            {orders.length === 0 ? (
              <View style={tw`p-4 bg-white rounded-lg shadow-md`}>
                <Text style={tw`text-center text-gray-500`}>No orders yet.</Text>
              </View>
            ) : (
              <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
        }
      />

            <TouchableOpacity
              onPress={handleLogout}
              style={tw`bg-red-500 p-4 mt-4 rounded`}
            >
              <View style={tw`flex-row justify-center items-center`}>
                <FontAwesome
                  name="sign-out"
                  size={20}
                  color="white"
                  style={tw`mr-2`}
                />
                <Text style={tw`text-white text-center`}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
