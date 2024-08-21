import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../../firebase';
import tw from 'twrnc';

const ScoreDetail = () => {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchScores = async () => {
      if (user) {
        const userUID = user.uid;
        const userDocRef = doc(db, 'users', userUID);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userScores = userData.scores ? userData.scores : null;
          setScores(userScores);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user authenticated');
      }
      setLoading(false);
    };

    fetchScores();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView>
        <View style={tw`mt-6 p-4`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={tw`mt-6 p-4`}>
        <Text style={tw`text-2xl mb-4`}>Score Details</Text>
        {scores ? (
          Object.keys(scores).map((quizId) => (
            <Text key={quizId} style={tw`text-lg`}>
              {quizId}: {scores[quizId]}
            </Text>
          ))
        ) : (
          <Text style={tw`text-lg`}>No scores available.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ScoreDetail;
