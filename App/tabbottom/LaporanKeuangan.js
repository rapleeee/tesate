import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const LaporanKeuangan = ({ uid }) => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("Modal");
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState("");
  const [isShowingTransactions, setIsShowingTransactions] = useState(true);

  useEffect(() => {
    const fetchUserFullname = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullname(userData.fullname);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserFullname(user.uid);
        fetchUserTransactions(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserTransactions = async (uid) => {
    try {
      const transactionsQuery = query(
        collection(db, "transactions"),
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(transactionsQuery);
      const fetchedTransactions = [];
      querySnapshot.forEach((doc) => {
        fetchedTransactions.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const addTransaction = async () => {
    if (amount && parseFloat(amount) !== 0) {
      const newTransaction = {
        uid: user.uid,
        type: selectedType,
        amount: parseFloat(amount),
        description: description,
        date: new Date(),
      };

      try {
        const docRef = await addDoc(
          collection(db, "transactions"),
          newTransaction
        );
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          { id: docRef.id, ...newTransaction },
        ]);
      } catch (error) {
        console.error("Failed to add transaction:", error);
      }

      setAmount("");
      setDescription("");
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id)); 
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error("Failed to remove transaction:", error);
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  const calculateBalance = () => {
    const totalIncome = transactions
      .filter((transaction) => ["Pemasukan", "Modal"].includes(transaction.type))
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) =>
        ["Pengeluaran", "Operasional", "HPP"].includes(transaction.type)
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    return totalIncome - totalExpense;
  };

  const calculateMarginPercentage = () => {
    const totalIncome = transactions
      .filter((transaction) => ["Pemasukan", "Modal"].includes(transaction.type))
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalOutcome = transactions
      .filter((transaction) =>
        ["Pengeluaran", "Operasional", "HPP"].includes(transaction.type)
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    if (totalIncome === 0) {
      return -100; // Jika total income 0, margin dianggap -100%
    }
    
    return ((totalIncome - totalOutcome) / totalIncome) * 100;
  };

  const totalIncome = transactions
    .filter((transaction) => ["Pemasukan", "Modal"].includes(transaction.type))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalOutcome = transactions
    .filter((transaction) =>
      ["Pengeluaran", "Operasional", "HPP"].includes(transaction.type)
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const marginPercentage = calculateMarginPercentage().toFixed(2);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#BB1624] p-4`}>
      <StatusBar />
      <View style={tw`bg-[#BB1624] p-4 rounded-lg`}>
        <Text style={tw`text-white text-lg text-center mb-10`}>
          Keuangan Toko
        </Text>
        <Text style={tw`text-white text-lg font-bold`}>{fullname}</Text>
        <Text style={tw`text-white`}>Kopi Konco</Text>

        <View style={tw`flex-row justify-between mt-4`}>
          <TextInput
            style={tw`bg-white p-2 rounded-lg flex-1 mr-2 border border-gray-300 text-left`}
            placeholder="Rp"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <View
            style={tw`bg-white rounded-lg border border-gray-300 flex-1 justify-center`}
          >
            <Picker
              selectedValue={selectedType}
              style={tw`flex-1`}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
            >
              <Picker.Item label="Modal" value="Modal" />
              <Picker.Item label="Operasional" value="Operasional" />
              <Picker.Item label="HPP" value="HPP" />
              <Picker.Item label="Pemasukan" value="Pemasukan" />
              <Picker.Item label="Pengeluaran" value="Pengeluaran" />
            </Picker>
          </View>
        </View>
        <TextInput
          style={tw`bg-white p-2 rounded-lg border border-gray-300 mt-2`}
          placeholder="Deskripsi"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TouchableOpacity
          onPress={addTransaction}
          style={tw`bg-blue-500 p-2 rounded-lg mt-2`}
        >
          <Text style={tw`text-white text-center`}>Submit</Text>
        </TouchableOpacity>
      </View>


      <View style={tw`flex-1 p-4 bg-white rounded-t-lg`}>
      <View style={tw`flex-row justify-between mt-4 bg-gray-200 rounded-lg`}>
        <TouchableOpacity
          style={tw`flex-1 p-2 bg-${
            isShowingTransactions ? "[#BB1624]" : "gray-200"
          } rounded-lg`}
          onPress={() => setIsShowingTransactions(true)}
        >
          <Text style={tw`text-center ${
              !isShowingTransactions ? "text-gray-800" : "text-white"}`}>Transaksi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 p-2 bg-${
            !isShowingTransactions ? "[#BB1624]" : "gray-200"
          } rounded-lg`}
          onPress={() => setIsShowingTransactions(false)}
        >
          <Text
            style={tw`text-center ${
              !isShowingTransactions ? "text-white" : "text-gray-800"
            }`}
          >
            Laporan
          </Text>
        </TouchableOpacity>
      </View>

      {isShowingTransactions ? (
        <View
          style={tw`bg-white p-2 mt-4`}
        >
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`flex-row justify-between mb-2`}>
                <View>
                  <Text style={tw`font-bold`}>{item.type}</Text>
                  <Text style={tw`text-gray-500`}>{item.description}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`text-right`}>
                    <Text style={tw`text-${
                      ["Modal", "Pemasukan"].includes(item.type) ? "green-600" : "black"
                    }`}>
                      Rp {item.amount.toLocaleString("id-ID")}
                    </Text>
                    <Text style={tw`text-gray-400 text-xs`}>
                      {formatDate(new Date(item.date.seconds * 1000))}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeTransaction(item.id)}
                    style={tw`ml-4`}
                  >
                    <FontAwesome name="trash-o" size={20} color="#BB1624" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <ScrollView>
          <View
          >
            <Text style={tw`font-bold text-lg mb-5 mt-5 text-center`}>
              Laporan Keuangan
            </Text>

            <View style={tw`flex-row justify-between mb-4`}>
              <View
                style={tw`bg-[#BB1624] p-4 rounded-lg flex-1 items-center`}
              >
                <Text style={tw`text-white text-lg font-bold mb-2` }>Outcome</Text>
                <View  style={tw`bg-white p-2 rounded-lg`}>
                <Text style={tw`text-black text-sm`}>
                  Rp {totalOutcome.toLocaleString("id-ID")}
                </Text>
                </View>
              </View>

              <View
                style={tw`bg-[#BB1624] p-4 rounded-lg flex-1 ml-2 items-center`}
              >
                <Text style={tw`text-white text-lg font-bold mb-2`}>Income</Text>
                <View  style={tw`bg-white p-2 rounded-lg`}>
                <Text style={tw`text-black text-sm`}>
                  Rp {totalIncome.toLocaleString("id-ID")}
                </Text>
                </View>
              </View>

              <View style={tw`bg-[#BB1624] p-4 rounded-lg flex-1 ml-2 items-center`}>
                <Text style={tw`text-white text-lg font-bold mb-2`}>Margin</Text>
              <View style={tw`bg-white p-2 rounded-lg`}>
                <Text style={tw`text-black text-sm`}>{marginPercentage}%</Text>
              </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      </View>
    </SafeAreaView>
  );
};

export default LaporanKeuangan;
