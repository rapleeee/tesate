import React, { useRef, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VideoMateriKeuanganII = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const navigation = useNavigation(); 

  const seekToTime = async (timeInSeconds, part) => {
    if (videoRef.current) {
      try {
        await videoRef.current.setPositionAsync(timeInSeconds * 1000);
        setSelectedPart(part); 
      } catch (error) {
        console.error('Error seeking video:', error);
      }
    }
  };


  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-5`}>
          <Ionicons name="arrow-back" size={24} color="gray" />
        </TouchableOpacity>

        <Text style={tw`text-lg font-bold mb-2`}>Lesson 2</Text>
        <Text style={[tw`text-base font-bold mb-5`, { color: '#BB1624' }]}>
            Building a Solid Business Model Canvas
        </Text>

        <View style={tw`w-full h-50 mb-5`}>
          <Video
            ref={videoRef}
            source={require('../../../../assets/Video/Keuangan.mp4')}
            style={tw`w-full h-full bg-gray-200 rounded-lg`}
            controls={true}
            resizeMode="contain"
            onError={(error) => console.error('Video Error:', error)}
            onBuffer={() => console.log('Buffering...')}
            useNativeControls
            isLooping
          />
        </View>

        <View style={tw`bg-gray-100 p-4 rounded-lg mb-5`}>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={{ color: selectedPart === 'intro' ? '#BB1624' : 'gray' }}>Intro</Text>
            <Text style={{ color: selectedPart === 'intro' ? '#BB1624' : 'gray' }}>0:20</Text>
          </View>
          <TouchableOpacity
            onPress={() => seekToTime(1 * 60 + 30, 'part1')}
            style={tw`flex-row justify-between mb-2`}
          >
            <Text style={{ color: selectedPart === 'part1' ? '#BB1624' : 'gray' }}>Part I</Text>
            <Text style={{ color: selectedPart === 'part1' ? '#BB1624' : 'gray' }}>1:30</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => seekToTime(3 * 60, 'part2')}
            style={tw`flex-row justify-between mb-2`}
          >
            <Text style={{ color: selectedPart === 'part2' ? '#BB1624' : 'gray' }}>Part II</Text>
            <Text style={{ color: selectedPart === 'part2' ? '#BB1624' : 'gray' }}>3:00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => seekToTime(4 * 60 + 30, 'part3')}
            style={tw`flex-row justify-between mb-2`}
          >
            <Text style={{ color: selectedPart === 'part3' ? '#BB1624' : 'gray' }}>Part III</Text>
            <Text style={{ color: selectedPart === 'part3' ? '#BB1624' : 'gray' }}>4:30</Text>
          </TouchableOpacity>
          <View style={tw`flex-row justify-between`}>
            <Text style={{ color: selectedPart === 'conclusion' ? '#BB1624' : 'gray' }}>Conclusion</Text>
            <Text style={{ color: selectedPart === 'conclusion' ? '#BB1624' : 'gray' }}>5:07</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => console.log('Next Lesson')}
          style={tw`bg-gray-500 rounded-lg p-4 items-center`}
        >
          <Text style={tw`text-white text-base`}>Next Lesson</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VideoMateriKeuanganII;
