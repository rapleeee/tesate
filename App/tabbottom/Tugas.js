import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';

const Tugas = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskType, setTaskType] = useState(null);
  const [coins, setCoins] = useState(200);
  const [dailyTaskCompleted, setDailyTaskCompleted] = useState(false);
  const [weeklyTaskCompleted, setWeeklyTaskCompleted] = useState(false);
  const [isRedeemModalVisible, setRedeemModalVisible] = useState(false);

  const [dailyTimeLeft, setDailyTimeLeft] = useState(null);
  const [weeklyTimeLeft, setWeeklyTimeLeft] = useState(null);

  const dailyResetTime = 10;
  const weeklyResetTime = 60;

  const toggleModal = (type) => {
    setTaskType(type);
    setModalVisible(true); // Ensure modal is shown when task is selected
  };

  const toggleRedeemModal = () => {
    setRedeemModalVisible(true); // Open redeem modal
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const completeDailyTask = () => {
    if (!dailyTaskCompleted) {
      setCoins(coins + 50);
      setDailyTaskCompleted(true);
      setDailyTimeLeft(dailyResetTime);
      alert('Tantangan Harian selesai! Anda mendapatkan 50 koin.');
      setModalVisible(false);

      const dailyInterval = setInterval(() => {
        setDailyTimeLeft((time) => {
          if (time === 1) {
            clearInterval(dailyInterval);
            setDailyTaskCompleted(false);
            return null;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      alert('Tantangan Harian sedang menunggu reset.');
    }
  };

  const completeWeeklyTask = () => {
    if (!weeklyTaskCompleted) {
      setCoins(coins + 125);
      setWeeklyTaskCompleted(true);
      setWeeklyTimeLeft(weeklyResetTime);
      alert('Tantangan Mingguan selesai! Anda mendapatkan 125 koin.');
      setModalVisible(false);

      const weeklyInterval = setInterval(() => {
        setWeeklyTimeLeft((time) => {
          if (time === 1) {
            clearInterval(weeklyInterval);
            setWeeklyTaskCompleted(false);
            return null;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      alert('Tantangan Mingguan sedang menunggu reset.');
    }
  };

  // Fungsi untuk membuka link ketika "Daftar Sekarang" dipencet
  const openWebinarLink = () => {
    const webinarURL = 'https://google.com'; // Ganti dengan URL yang sesuai
    Linking.openURL(webinarURL).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const renderTaskModalContent = () => {
    switch (taskType) {
      case 'daily':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tantangan Harian</Text>
            <View style={styles.challengeBox}>
              <Text style={styles.challengeText}>Dapatkan 30 XP</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '70%' }]} />
              </View>
            </View>
            <View style={styles.challengeBox}>
              <Text style={styles.challengeText}>Selesaikan 10 pertanyaan kuis</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
            </View>
            <View style={styles.challengeBox}>
              <Text style={styles.challengeText}>Belajar selama 5 menit</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '30%' }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.completeButton} onPress={completeDailyTask}>
              <Text style={styles.completeButtonText}>Selesaikan Daily Task</Text>
            </TouchableOpacity>
          </View>
        );
      case 'weekly':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tantangan Mingguan</Text>
            <View style={styles.challengeBox}>
              <Text style={styles.challengeText}>Dapatkan 125 XP</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '70%' }]} />
              </View>
            </View>
            <View style={styles.challengeBox}>
              <Text style={styles.challengeText}>Selesaikan 50 pertanyaan kuis</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
            </View>
            <View style={styles.challengeBox}>
              <Text style={styles.challengeText}>Belajar selama 30 menit</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '30%' }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.completeButton} onPress={completeWeeklyTask}>
              <Text style={styles.completeButtonText}>Selesaikan Weekly Task</Text>
            </TouchableOpacity>
          </View>
        );
      case 'newYear':
        return (
          <View style={styles.newYearModalContent}>
            <Text style={styles.newYearTitle}>Tantangan</Text>
            <Text style={styles.newYearSubtitle}>Tahun Baru</Text>
            <View style={styles.newYearDescriptionBox}>
              <Text style={styles.newYearDescription}>
                Ikuti Webinar Perencanaan Keuangan untuk memulai tahun baru dengan baik! {"\n\n"}
                Pelajari cara mengatur anggaran, meningkatkan pendapatan, dan strategi investasi untuk bisnis Anda.
              </Text>
            </View>
            <Text style={styles.newYearSteps}>
              Cara Berpartisipasi: {"\n"}
              1. Daftar Sekarang {"\n"}
              2. Catat Tanggal dan Waktu {"\n"}
              3. Ikuti Webinar Secara Online. {"\n"}
            </Text>
            <Text style={styles.newYearReward}>
              Reward: {"\n"} • Sertifikat partisipasi
            </Text>
            <TouchableOpacity style={styles.newYearCTAButton} onPress={openWebinarLink}>
              <Text style={styles.newYearCTAButtonText}>Daftar Sekarang!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.newYearCloseButton}>
              <Icon name="close-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={tw`bg-white`}>
      <ScrollView>
        <View style={tw`relative mt-4`}>
          <Image
            source={require('./../assets/AkunPage/Promotion.png')}
            style={tw`w-full h-50 mb-15`}
            resizeMode="stretch"
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <Icon name="chevron-back" size={30} color="#000" />
          </TouchableOpacity>
          <View style={tw`absolute w-full items-center top-10`}>
            <Text style={tw`text-white text-lg`}>Current Coins</Text>
            <Text style={tw`text-white text-4xl font-bold mt-2`}>{coins}</Text>
            <Image source={require('./../assets/tugasPage/coin.png')} style={tw`w-10 h-10 mt-2`} />
            <TouchableOpacity style={tw`bg-yellow-400 rounded-full py-2 px-4 mt-4`}>
              <Text style={tw`text-yellow-900 font-bold`}>Ambassador Elite</Text>
            </TouchableOpacity>
            <Text style={tw`text-black mt-2`}>Ikuti tantangan dan dapatkan hadiahnya!</Text>
          </View>
        </View>

        {/* Task Sections */}
        <View style={tw`flex-1 p-4`}>
          {/* Daily Task */}
          <View style={tw`bg-gray-200 p-4 rounded-lg flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>Daily Task</Text>
              <Text style={tw`ml-2 text-blue-600`}>XP 50</Text>
              <Image source={require('./../assets/tugasPage/coin.png')} style={tw`ml-2 w-6 h-6`} />
            </View>
            {dailyTaskCompleted ? (
              <Text style={tw`text-red-600`}>
                Menunggu: {dailyTimeLeft !== null ? formatTime(dailyTimeLeft) : ''}
              </Text>
            ) : (
              <TouchableOpacity style={tw`bg-red-600 rounded-full py-2 px-4`} onPress={() => toggleModal('daily')}>
                <Text style={tw`text-white text-lg`}>Start</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Weekly Task */}
          <View style={tw`bg-gray-200 p-4 rounded-lg flex-row justify-between items-center mt-4`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>Weekly Task</Text>
              <Text style={tw`ml-2 text-blue-600`}>XP 125</Text>
              <Image source={require('./../assets/tugasPage/coin.png')} style={tw`ml-2 w-6 h-6`} />
            </View>
            {weeklyTaskCompleted ? (
              <Text style={tw`text-red-600`}>
                Menunggu: {weeklyTimeLeft !== null ? formatTime(weeklyTimeLeft) : ''}
              </Text>
            ) : (
              <TouchableOpacity style={tw`bg-red-600 rounded-full py-2 px-4`} onPress={() => toggleModal('weekly')}>
                <Text style={tw`text-white text-lg`}>Start</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* New Year Task */}
          <View style={tw`bg-blue-100 p-4 rounded-lg flex-row justify-between items-center mt-6`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>New Year Task</Text>
              <Text style={tw`ml-2 text-yellow-600`}>Reward: Sertifikat</Text>
            </View>
            <TouchableOpacity style={tw`bg-yellow-600 rounded-full py-2 px-4`} onPress={() => toggleModal('newYear')}>
              <Text style={tw`text-white text-lg`}>Join</Text>
            </TouchableOpacity>
          </View>

          {/* Redeem Section */}
          <View style={tw`bg-gray-200 p-4 rounded-lg flex-row justify-between items-center mt-6`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-bold`}>Education</Text>
            </View>
            <TouchableOpacity style={tw`bg-red-600 rounded-full py-2 px-4`} onPress={toggleRedeemModal}>
              <Text style={tw`text-white text-lg`}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Redeem Modal */}
        <Modal visible={isRedeemModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.redeemModalContent}>
              <TouchableOpacity onPress={() => setRedeemModalVisible(false)} style={styles.redeemCloseButton}>
                <Icon name="close-circle" size={30} color="#fff" />
              </TouchableOpacity>

              {/* Redeem Content */}
              <View style={styles.redeemContentBox}>
                <Text style={styles.redeemTitle}>Diskon 25% Subscription Saraya</Text>
                <Text style={styles.redeemDescription}>
                  Dapatkan diskon eksklusif 25% untuk langganan Saraya Anda! Gunakan kupon ini untuk mengembangkan bisnis Anda.
                </Text>
              </View>

              <TouchableOpacity style={styles.redeemCTAButton}>
                <Text style={styles.redeemCTAButtonText}>Redeem Sekarang!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Task Modals */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            {renderTaskModalContent()}
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#1D3557',
    borderRadius: 15,
    position: 'relative',
    alignItems: 'center',
  },
  challengeBox: {
    backgroundColor: '#FDCB6E',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  challengeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FAB005',
    borderRadius: 5,
  },
  completeButton: {
    backgroundColor: '#00e676',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newYearModalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#E5F3FE',
    borderRadius: 20,
    alignItems: 'center',
  },
  newYearTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#305F72',
  },
  newYearSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#305F72',
    marginBottom: 20,
  },
  newYearDescriptionBox: {
    backgroundColor: '#F1F9FF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  newYearDescription: {
    fontSize: 16,
    color: '#1D3557',
    textAlign: 'center',
  },
  newYearSteps: {
    fontSize: 16,
    color: '#1D3557',
    marginBottom: 20,
  },
  newYearReward: {
    fontSize: 16,
    color: '#1D3557',
    marginBottom: 20,
    textAlign: 'center',
  },
  newYearCTAButton: {
    backgroundColor: '#00B4D8',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  newYearCTAButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  newYearCloseButton: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
  redeemModalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FBE9E7',
    borderRadius: 20,
    alignItems: 'center',
  },
  redeemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D84315',
  },
  redeemDescription: {
    fontSize: 16,
    color: '#BF360C',
    textAlign: 'center',
    marginVertical: 20,
  },
  redeemCTAButton: {
    backgroundColor: '#E64A19',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  redeemCTAButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  redeemCloseButton: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
});

export default Tugas;
