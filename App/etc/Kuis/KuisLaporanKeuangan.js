import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { reactQuestions } from '../../config/Questions';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './../../../firebase';

const KuisLaporanKeuangan = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userUID = user ? user.uid : null;
  const userEmail = user ? user.email : null;

  const saveQuizScore = async (uid, quizId, score) => {
    try {
      console.log('UID:', uid);  // Log UID
      console.log('Quiz ID:', quizId);  // Log quiz ID
      console.log('Score:', score);  // Log score

      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedScores = { ...userData.scores, [quizId]: score };
        await setDoc(userDocRef, { ...userData, scores: updatedScores }, { merge: true });
        console.log('Score saved successfully');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === reactQuestions.length - 1) {
      saveQuizScore(userUID, 'quizLaporanKeuangan', score)  // Save the score with a unique key for this quiz
        .then(() => {
          navigation.navigate('scoreLaporanKeuangan', { score: score });
        })
        .catch((error) => {
          console.error('Error finishing quiz:', error);
        });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset the selected option for the next question
      setIsCorrect(null); // Reset the correctness state for the next question
    }
  };

  const handleOptionPress = (pressedOption) => {
    setSelectedOption(pressedOption);

    const isAnswerCorrect = reactQuestions[currentQuestionIndex].correctAnswer === pressedOption;

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 20);
    }
  };

  return (
    <SafeAreaView>
      <View style={tw`mt-6 p-4`}>
        <Text style={tw`text-2xl mb-4`}>
          {reactQuestions[currentQuestionIndex].question}
        </Text>
        {reactQuestions[currentQuestionIndex].options.map((option) => (
          <Pressable
            key={option}
            style={tw`border-2 p-4 my-2 rounded-md ${
              selectedOption === option
                ? isCorrect
                  ? 'bg-green-200 border-green-500'
                  : 'bg-red-200 border-red-500'
                : 'border-purple-500'
            }`}
            onPress={() => handleOptionPress(option)}
            disabled={selectedOption}
          >
            <Text style={tw`text-lg`}>{option}</Text>
          </Pressable>
        ))}
        <Pressable
          style={tw`bg-purple-500 p-4 rounded-md mt-6`}
          onPress={handleNext}
        >
          <Text style={tw`text-white text-lg text-center font-bold`}>
            {currentQuestionIndex === reactQuestions.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default KuisLaporanKeuangan;

const styles = StyleSheet.create({});
