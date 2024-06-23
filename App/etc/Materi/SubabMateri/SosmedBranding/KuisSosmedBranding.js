import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { reactQuestionsSosmed } from '../../../../config/QuestionsSosmed';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './../../../../../firebase';

const KuisSosmedBranding = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userUID, setUserUID] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUserUID(user.uid);
    } else {
      console.log('No user authenticated');
      Alert.alert('Error', 'No user authenticated');
    }
  }, [user]);

  const saveQuizScore = async (uid, quizId, score) => {
    try {
      console.log('UID:', uid);  // Log UID
      console.log('Quiz ID:', quizId);  // Log quiz ID
      console.log('Score:', score);  // Log score

      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Existing user data:', userData);  // Log existing user data
        const updatedScores = { ...userData.scores, [quizId]: score };
        await setDoc(userDocRef, { ...userData, scores: updatedScores }, { merge: true });
        console.log('Score saved successfully');
        // Alert.alert('Success', 'Score saved successfully');
      } else {
        console.log('No such document!');
        Alert.alert('Error', 'No such document!');
      }
    } catch (error) {
      console.error('Failed to save score:', error);
      Alert.alert('Error', 'Failed to save score');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === reactQuestionsSosmed.length - 1) {
      saveQuizScore(userUID, 'quizSosmedBranding', score)  // Save the score with a unique key for this quiz
        .then(() => {
          navigation.navigate('scoreSosmedBranding', { score: score });
        })
        .catch((error) => {
          console.error('Error finishing quiz:', error);
          Alert.alert('Error', 'Error finishing quiz');
        });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset the selected option for the next question
      setIsCorrect(null); // Reset the correctness state for the next question
    }
  };

  const handleOptionPress = (pressedOption) => {
    setSelectedOption(pressedOption);

    const isAnswerCorrect = reactQuestionsSosmed[currentQuestionIndex].correctAnswer === pressedOption;

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 20);
    }
  };

  if (!userUID) {
    return (
      <SafeAreaView>
        <View style={tw`mt-6 p-4`}>
          <Text style={tw`text-xl`}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={tw`mt-6 p-4`}>
        <Text style={tw`text-2xl mb-4`}>
          {reactQuestionsSosmed[currentQuestionIndex].question}
        </Text>
        {reactQuestionsSosmed[currentQuestionIndex].options.map((option) => (
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
            disabled={selectedOption !== null}
          >
            <Text style={tw`text-lg`}>{option}</Text>
          </Pressable>
        ))}
        <Pressable
          style={tw`bg-purple-500 p-4 rounded-md mt-6`}
          onPress={handleNext}
        >
          <Text style={tw`text-white text-lg text-center font-bold`}>
            {currentQuestionIndex === reactQuestionsSosmed.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default KuisSosmedBranding;
