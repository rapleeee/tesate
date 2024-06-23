import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const LaporanKeuangan = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const addTransaction = (type) => {
    if (amount && parseFloat(amount) !== 0) {
      const newTransaction = {
        id: Math.random().toString(),
        type: type,
        amount: parseFloat(amount),
        description: description,
        date: new Date(),
      };

      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      setAmount('');
      setDescription('');
    }
  };

  const removeTransaction = (id) => {
    setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== id));
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const calculateBalance = () => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);

    return totalIncome - totalExpense;
  };

  const totalIncome = transactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (

    
    
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.timeText}>
          {currentTime.toLocaleTimeString()}
        </Text>
        <Text style={styles.dateText}>
          {currentTime.toDateString()}
        </Text>
      </View>
         <Text style={styles.header}>Pembukuan Toko</Text>
      <View style={styles.card}>
          <Text style={{marginLeft:-5, color:'green'}}> Hand In: {calculateBalance()}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Jumlah"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Deskripsi"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Uang Masuk" onPress={() => addTransaction('income')} />
        <Button title="Uang Keluar" onPress={() => addTransaction('expense')} />
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsHeader}>Transaksi:</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text>{`${item.type === 'income' ? '+' : '-'} ${item.amount} (${item.description})  ${formatDate(item.date)})`}</Text>
              <TouchableOpacity onPress={() => removeTransaction(item.id)}>
                <Text style={styles.removeButton}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'#E8E8E8'
  },
  card:{
    backgroundColor:'white',
    padding:16,
    borderRadius:4,
    marginRight:9,
    marginBottom:16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  transactionsContainer: {
    marginBottom: 16,
  },
  transactionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    color: 'red',
    marginLeft: 8,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  container1: {
    alignItems: 'left',
    marginTop: 15,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 20,
  },
});

export default LaporanKeuangan;
