import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Text from "../Shared/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const WaitingOrders = () => {
  const navigation = useNavigation();
  const [ordersState, setOrdersState] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Menunggu Konfirmasi");
  const biayaAplikasi = 2000;
  const biayaOngkir = 5000;
  const [countdown, setCountdown] = useState(35 * 60);
  const [orderDocId, setOrderDocId] = useState(null);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.orders) {
          setOrderStatus(data.status || "Menunggu Konfirmasi");
          setOrderDocId(doc.id);
        }
        return data.orders ? data.orders.map(order => ({ ...order, docId: doc.id })) : [];
      }).flat();
      setOrdersState(ordersData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadCountdown();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newTime = prev - 1;
          AsyncStorage.setItem("countdown", JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const loadCountdown = async () => {
    const savedCountdown = await AsyncStorage.getItem("countdown");
    if (savedCountdown) {
      setCountdown(JSON.parse(savedCountdown));
    }
  };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOrderReceived = async () => {
    if (orderDocId) {
      await updateDoc(doc(db, "orders", orderDocId), {
        status: "Diterima",
      });
    }
  };

  const totalPesanan = ordersState.reduce((acc, item) => acc + (item.price * (item.count || 1)), 0);
  const totalBiaya = totalPesanan + biayaAplikasi + biayaOngkir;

  if (orderStatus === "Diterima") {
    return (
      <View style={tw`flex items-center justify-center mt-24`}>
        <Image source={require('../assets/none.png')} style={tw`w-40 h-40`} />
        <Text style={tw`text-lg font-semibold text-gray-600 mt-4`}>Kamu belum pesan loh!</Text>
        <Text style={tw`text-base text-gray-500`}>Pesen dulu cepat!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar />
      <FlatList
        ListHeaderComponent={
          <View style={tw`mx-4 mt-4`}>
            <View style={tw`flex-row items-center justify-between`}>
              <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
              <AntDesign name="setting" size={24} color="black" onPress={() => alert('Sedang dalam perbaikan')} />
            </View>
            <View style={tw`items-center justify-center mt-4`}>
              <Image source={require('../assets/waiting.png')} style={tw`w-64 h-54`} />
              <Text style={tw`text-2xl font-bold text-neutral-800 mt-4`}>Tunggu Lhoo...</Text>
              <Text style={tw`text-xl text-neutral-700`}>Pesanan Kamu lagi diproses</Text>
              <Text style={tw`text-sm text-neutral-700`}>Tunggu aja depan rumah nanti juga sampe kok</Text>
              <Text style={tw`text-lg font-bold text-blue-600 mt-2`}>Status: {orderStatus}</Text>
              <Text style={tw`text-lg font-bold text-red-600`}>Sisa Waktu: {formatCountdown(countdown)}</Text>
              {orderStatus === "Diantar" && (
                <TouchableOpacity onPress={handleOrderReceived} style={tw`bg-blue-500 px-4 py-2 rounded-lg mt-4`}>
                  <Text style={tw`text-white font-semibold`}>Pesanan Diterima</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={tw`text-xl font-bold text-neutral-700 mt-4`}>Pesanan Kamu</Text>
          </View>
        }
        data={ordersState}
        keyExtractor={(item) => `${item.docId}-${item.id}`}
        renderItem={({ item }) => {
          const count = item.count || 1;
          const price = parseInt(item.price, 10) || 0;
          const totalHarga = count * price;

          return (
            <View style={tw`p-2 rounded-lg mt-4 border border-gray-300 mx-4`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-base font-semibold`}>{count}x {item.name}</Text>
                <Text style={tw`text-right text-base font-semibold`}>Rp {totalHarga}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default WaitingOrders;
