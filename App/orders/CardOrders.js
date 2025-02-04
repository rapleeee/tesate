import { View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Text from '../Shared/Text';
import { CartContext } from './CartContext';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CardOrders = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { cart, setCart } = useContext(CartContext);
    const initialOrders = Array.isArray(route.params?.orders) ? route.params.orders : cart || [];
    const [ordersState, setOrdersState] = useState(initialOrders);
    const [userAddress, setUserAddress] = useState("");
    const [totalBiaya, setTotalBiaya] = useState(0);

    const db = getFirestore();
    const auth = getAuth();

    // Biaya tambahan
    const biayaAplikasi = 2000;
    const biayaOngkir = 5000;

    useEffect(() => {
        const fetchUserAddress = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserAddress(userDoc.data().address || "");
                }
            }
        };

        fetchUserAddress();
    }, []);

    useEffect(() => {
        const totalPesanan = ordersState.reduce((acc, item) => acc + ((parseInt(item.price, 10) || 0) * (item.count || 1)), 0);
        setTotalBiaya(totalPesanan + biayaAplikasi + biayaOngkir);
    }, [ordersState]);

    const handlePayment = async () => {
        if (!userAddress) {
            Alert.alert("Alamat Kosong", "Silakan isi alamat pengantaran terlebih dahulu.");
            return;
        }

        Alert.alert(
            "Konfirmasi Pembayaran",
            `Total Biaya: Rp ${totalBiaya}\nPesanan kamu akan segera dikirim!`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            if (user) {
                                await addDoc(collection(db, "orders"), {
                                    userId: user.uid,
                                    orders: ordersState,
                                    totalAmount: totalBiaya,
                                    address: userAddress,
                                    status: "Menunggu konfirmasi",
                                    createdAt: new Date()
                                });

                                setCart([]);
                                setOrdersState([]);
                                navigation.navigate("waitingOrders");
                            }
                        } catch (error) {
                            console.error("Gagal menyimpan pesanan:", error);
                            Alert.alert("Error", "Terjadi kesalahan saat menyimpan pesanan.");
                        }
                    }
                }
            ]
        );
    };

    const handleDecreaseItem = (id) => {
        setOrdersState((prevOrders) => {
            const updatedOrders = prevOrders
                .map((item) => (item.id === id ? { ...item, count: item.count - 1 } : item))
                .filter(item => item.count > 0);
            setCart(updatedOrders);
            return updatedOrders;
        });
    };

    return (
        <SafeAreaView>
            <StatusBar />
            <View style={tw`mx-4 mt-4`}>
                <View style={tw`flex-row items-center justify-between`}>
                    <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
                    <Text style={tw`text-2xl font-bold text-black`}>Pesanan Kamu</Text>
                    <AntDesign name="setting" size={24} color="black" onPress={() => alert('Sedang dalam perbaikan')} />
                </View>

                {ordersState.length === 0 ? (
                    <View style={tw`flex items-center justify-center mt-24`}>
                        <Image source={require('../assets/none.png')} style={tw`w-40 h-40`} />
                        <Text style={tw`text-lg font-semibold text-gray-600 mt-4`}>Kamu belum pesan loh!</Text>
                        <Text style={tw`text-base text-gray-500`}>Pesen dulu cepat!</Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={ordersState}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                const count = item.count || 1;
                                const price = parseInt(item.price, 10) || 0;
                                const totalHarga = count * price;

                                return (
                                    <View style={tw`p-4 rounded-lg mt-4 border border-gray-300`}>
                                        <View style={tw`flex-row justify-between items-center`}>
                                            <Text style={tw`text-lg font-semibold`}>{count}x {item.name}</Text>
                                            <Text style={tw`text-right text-lg font-semibold`}>Rp {totalHarga}</Text>
                                            <TouchableOpacity onPress={() => handleDecreaseItem(item.id)}>
                                                <AntDesign name="minuscircle" size={24} color="red" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }}
                        />

                        <View style={tw`border-t border-gray-300 my-2`} />
                        <View style={tw`flex-row justify-between`}>
                            <Text style={tw`text-gray-600`}>Biaya Aplikasi</Text>
                            <Text style={tw`text-gray-600`}>Rp {biayaAplikasi}</Text>
                        </View>
                        <View style={tw`flex-row justify-between mt-1`}>
                            <Text style={tw`text-gray-600`}>Biaya Pesan Antar</Text>
                            <Text style={tw`text-gray-600`}>Rp {biayaOngkir}</Text>
                        </View>
                        <View style={tw`border-t border-gray-300 my-2`} />

                        <View style={tw`flex-row justify-between`}>
                            <Text style={tw`text-lg font-bold`}>Total Biaya</Text>
                            <Text style={tw`text-lg font-bold`}>Rp {totalBiaya}</Text>
                        </View>

                        <Text style={tw`text-gray-500 mt-1`}>Estimasi Waktu Antar: 30-35 mins</Text>

                        <View style={tw`mt-4`}>
                            <TouchableOpacity style={tw`bg-[#2E2E2E] p-4 rounded-lg mb-2`} onPress={handlePayment}>
                                <View style={tw`flex-row items-center justify-between`}>
                                    <Ionicons name="cash-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Bayar Cash aja</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`bg-[#680BB0] p-4 rounded-lg mb-2`}>
                                <View style={tw`flex-row items-center justify-between`}>
                                    <FontAwesome name="credit-card" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold`}>Bayar Pake Ovo</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`bg-[#B00B3F] p-4 rounded-lg mb-2`}>
                                <View style={tw`flex-row items-center justify-between`}>
                                    <Ionicons name="qr-code-outline" size={24} color="white" />
                                    <Text style={tw`text-white text-base font-semibold ml-2`}>Bayar Pake Qris</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CardOrders;
