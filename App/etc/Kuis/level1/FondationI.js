import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { reactQuestions } from '../../../config/Questions';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './../../../../firebase';
import { Ionicons } from '@expo/vector-icons';

const FondationI = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userUID, setUserUID] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [xp, setXp] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUserUID(user.uid);
      fetchUserXp(user.uid);
    }

    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const fetchUserXp = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setXp(userDoc.data().xp || 0);
      }
    } catch (error) {
      console.error("Gagal mengambil XP pengguna:", error);
    }
  };

  const handleOptionPress = (pressedOption) => {
    setSelectedOption(pressedOption);
    const isAnswerCorrect =
      reactQuestions[currentQuestionIndex].correctAnswer === pressedOption;

    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect) {
      setIncorrectQuestions((prev) => [
        ...prev,
        reactQuestions[currentQuestionIndex],
      ]);
    } else {
      setAnsweredCorrectly((prev) => new Set(prev).add(currentQuestionIndex));
    }
  };

   // Fungsi sinkronisasi XP ke Firestore
   const updateXpInFirestore = async (updatedXp) => {
    try {
      const userDocRef = doc(db, 'users', userUID);
      await updateDoc(userDocRef, { xp: updatedXp });
      console.log('XP berhasil disinkronkan ke Firestore');
    } catch (error) {
      console.error('Gagal menyinkronkan XP:', error);
    }
  };

  const handleNext = async () => {
    if (selectedOption === null) {
      Alert.alert("Pilih jawaban terlebih dahulu!");
      return;
    }

    if (currentQuestionIndex === reactQuestions.length - 1) {
      if (incorrectQuestions.length > 0) {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        Alert.alert("Perbaiki Jawaban", "Masih ada jawaban salah. Silakan ulangi.");
      } else {
        setXp((prevXp) => {
          const updatedXp = prevXp + 30; // Tambah XP
          updateXpInFirestore(updatedXp); // Sinkronkan ke Firestore
          return updatedXp; // Perbarui state
        });

        saveTimeSpent(userUID, timeElapsed); // Simpan waktu
        navigation.navigate("scoreLaporanKeuangan", { timeSpent: timeElapsed });
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };
  
  const saveQuizScore = async (uid, xpEarned) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        xp: xp + xpEarned,
      });
      setXp(xp + xpEarned);
      console.log('XP berhasil disimpan');
    } catch (error) {
      console.error('Gagal menyimpan XP:', error);
    }
  };

  const saveTimeSpent = async (uid, timeSpent) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedTimeSpent = {
          ...userData.timeSpent,
          quizLaporanKeuangan: timeSpent,
        };
        await setDoc(userDocRef, { timeSpent: updatedTimeSpent }, { merge: true });
        console.log('Waktu berhasil disimpan');
      }
    } catch (error) {
      console.error('Gagal menyimpan waktu:', error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView style={tw`p-4`}>
        <Text style={tw`text-base font-bold text-center mt-4 mb-5`}>
          {reactQuestions[currentQuestionIndex].question}
        </Text>

        {reactQuestions[currentQuestionIndex].options.map((option) => (
          <Pressable
            key={option}
            style={[
              tw`border-2 p-2 my-2 rounded-lg`,
              selectedOption === option
                ? isCorrect
                  ? tw`bg-green-200 border-green-500`
                  : tw`bg-red-200 border-red-500`
                : tw`border-gray-300`,
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={selectedOption !== null}
          >
            <Text style={tw`text-sm text-center`}>{option}</Text>
          </Pressable>
        ))}

        {selectedOption !== null && !isCorrect && (
          <Text style={tw`text-red-500 mt-2`}>
            Jawaban benar:{" "}
            {reactQuestions[currentQuestionIndex].correctAnswer}
          </Text>
        )}

        <Pressable
          style={tw`bg-[#BB1624] p-2 rounded-lg mt-6 mb-5`}
          onPress={handleNext}
        >
          <Text style={tw`text-white text-center text-base`}>
            {currentQuestionIndex === reactQuestions.length - 1
              ? "Finish"
              : "Next"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FondationI;
