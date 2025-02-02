import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Text from '../Shared/Text';

const CardOrders = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <StatusBar />
            <View style={tw`mx-4 mt-4`}>
                <View style={tw`flex-row items-center justify-between`}>
                    <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
                    <AntDesign name="setting" size={24} color="black" onPress={() => alert('Sedang dalam perbaikan')} />
                </View>

                <Text style={tw`text-2xl font-bold text-black mt-4`}>Pesanan Kamu</Text>

                <View style={tw`p-4 rounded-lg mt-4`}>
                <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-lg font-semibold`}>2x Sate Ayam Cik</Text>
                    <Text style={tw`text-right text-lg font-semibold`}>Rp 30.000</Text>
                </View>
                    <View style={tw`border-t border-gray-300 my-2`} />
                    <View style={tw`flex-row justify-between`}>
                        <Text style={tw`text-gray-600`}>Biaya Aplikasi</Text>
                        <Text style={tw`text-gray-600`}>Rp 2.000</Text>
                    </View>
                    <View style={tw`flex-row justify-between mt-1`}>
                        <Text style={tw`text-gray-600`}>Biaya Pesan Antar</Text>
                        <Text style={tw`text-gray-600`}>Rp 5.000</Text>
                    </View>
                    <View style={tw`border-t border-gray-300 my-2`} />

                    <View style={tw`flex-row justify-between`}>
                        <Text style={tw`text-lg font-bold`}>Total Biaya</Text>
                        <Text style={tw`text-lg font-bold`}>Rp 37.000</Text>
                    </View>

                    <Text style={tw`text-gray-500 mt-1`}>Estimasi Waktu Antar: 30-35 mins</Text>
                </View>
                <View style={tw`mt-4`}>
                    <TouchableOpacity style={tw`bg-[#2E2E2E]  p-4 rounded-lg mb-2`}>
                        <View style={tw`flex-row items-center justify-between `}>
                            <Ionicons name="cash-outline" size={24} color="white" />
                            <Text style={tw`text-white text-base font-semibold ml-2`}>Bayar Cash aja</Text>
                            <AntDesign name="checkcircleo" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`bg-[#680BB0]  p-4 rounded-lg mb-2`}>
                        <View style={tw`flex-row items-center justify-between `}>
                            <FontAwesome name="credit-card" size={24} color="white" />
                            <Text style={tw`text-white text-base font-semibold ml-2`}>Bayar Pake Ovo</Text>
                            <AntDesign name="checkcircleo" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`bg-[#B00B3F]  p-4 rounded-lg mb-2`}>
                        <View style={tw`flex-row items-center justify-between `}>
                            <Ionicons name="qr-code-outline" size={24} color="white" />
                            <Text style={tw`text-white text-base font-semibold ml-2`}>Bayar Pake Qris</Text>
                            <AntDesign name="checkcircleo" size={20} color="white" />
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default CardOrders;
