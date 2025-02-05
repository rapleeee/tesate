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
} from "firebase/firestore";
import { db } from "../../firebase";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Text from "../Shared/Text";
import { useNavigation } from "@react-navigation/native";

const CompletedOrders = () => {
  const navigation = useNavigation();
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const completedData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((order) => order.status === "Diterima");
      setCompletedOrders(completedData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1`}> 
      <StatusBar />
      <View style={tw`mx-4 mt-4`}> 
        <View style={tw`flex-row items-center justify-between`}> 
          <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
          <Text style={tw`text-xl font-bold`}>Transaksi Selesai</Text>
        </View>
      </View>
      <FlatList 
        data={completedOrders} 
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <View style={tw`p-2 rounded-lg mt-4 border border-gray-300 mx-4`}> 
            <Text style={tw`text-base font-semibold`}>Pesanan ID: {item.id}</Text>
            <Text style={tw`text-sm text-gray-500`}>Total Harga: Rp {item.totalPrice} 57.000</Text>
            <Text style={tw`text-sm text-gray-500`}>Total Harga: Rp {item.status} </Text>
          </View>
        )} 
      />
    </SafeAreaView>
  );
};

export default CompletedOrders;
