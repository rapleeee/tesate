import { View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../Shared/Text';

const DetailOrders = () => {
    const navigation = useNavigation();
    const route = useRoute(); // Pindahkan ke atas sebelum destructuring

    const { item, orders = [] } = route.params || {}; // Pastikan params tidak undefined
    const [count, setCount] = useState(1);
    const [stock, setStock] = useState(item?.stock || 0); // Tambahkan fallback jika item undefined

    const increaseCount = () => {
        if (count < stock) {
            setCount(prev => prev + 1);
            setStock(prev => prev - 1);
        } else {
            Alert.alert("Stok Habis", "Jumlah pesanan melebihi stok yang tersedia.");
        }
    };

    const decreaseCount = () => {
        if (count > 1) {
            setCount(prev => prev - 1);
            setStock(prev => prev + 1);
        }
    };

    return (
        <SafeAreaView>
            <View style={tw`mx-4 mt-4`}>
                {/* Header */}
                <View style={tw`flex-row items-center justify-between`}>
                    <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
                    <AntDesign name='setting' size={24} color='black' onPress={() => Alert.alert('Sedang dalam perbaikan')} />
                </View>

                {/* Gambar */}
                <Image source={require('../assets/sateh.png')} style={tw`w-full h-80`} />

                {/* Detail Item */}
                <View>
                    <Text style={tw`font-bold text-2xl`}>{item?.name || "Produk"}</Text>

                    <View style={tw`flex-row items-center mt-2`}>
                        <MaterialCommunityIcons name='timer' size={24} color='black' />
                        <Text style={tw`ml-2`}>{item?.cookingTime || 0} menit</Text>
                    </View>

                    <Text style={tw`mt-2 text-justify`}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </Text>

                    {/* Harga & Jumlah */}
                    <View style={tw`flex-row items-center justify-between mt-4`}>
                        <View style={tw`bg-[#5CB85C] px-4 py-2 rounded-lg`}>
                            <Text style={tw`text-white`}>Rp {item?.price || 0}</Text>
                        </View>

                        <View style={tw`flex-row items-center`}>
                            <TouchableOpacity
                                style={tw`bg-[#5CB85C] p-1 rounded-lg items-center justify-center shadow-md`}
                                onPress={decreaseCount}
                            >
                                <Ionicons name="remove" size={20} color="white" />
                            </TouchableOpacity>

                            <Text style={tw`text-lg mx-2`}>{count}</Text>

                            <TouchableOpacity
                                style={tw`bg-[#5CB85C] p-1 rounded-lg items-center justify-center shadow-md`}
                                onPress={increaseCount}
                            >
                                <Ionicons name="add" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stok */}
                    <Text style={tw`mt-2 text-gray-600`}>Stok Tersisa: {stock}</Text>

                    {/* Tombol */}
                    <View style={tw`flex-row items-center justify-between mt-2`}>
                        <TouchableOpacity
                            style={tw`bg-[#2E2E2E] px-4 py-3 rounded-lg mt-4`}
                            onPress={() => Alert.alert("Ditambahkan ke Keranjang", `Anda telah menambahkan ${count} item.`)}
                        >
                            <Text style={tw`text-white`}>Tambah Ke Keranjang</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`bg-[#2E2E2E] px-4 py-3 rounded-lg mt-4`}
                            onPress={() => navigation.navigate('cardOrders', { orders: [{ ...item, count }] })}
                        >
                            <Text style={tw`text-white`}>Pesan Sekarang</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default DetailOrders;
