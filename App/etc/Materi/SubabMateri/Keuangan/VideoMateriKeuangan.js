import React, { useRef, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

const VideoMateriKeuangan = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // for the progress bar
  const [currentTime, setCurrentTime] = useState(0); // current time of video
  const [duration, setDuration] = useState(0); // duration of the video
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        videoRef.current.getStatusAsync().then((status) => {
          if (status.isLoaded && status.durationMillis > 0) {
            setProgress((status.positionMillis / status.durationMillis) * 100);
            setCurrentTime(status.positionMillis);
            setDuration(status.durationMillis);
          }
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

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

  // Handler for when video finishes
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish && !status.isLooping) {
      navigation.navigate("videoKeuanganII"); // Navigate to next video when finished
    }
  };

  // Convert milliseconds to time format (mm:ss)
  const formatTime = (timeMillis) => {
    const minutes = Math.floor(timeMillis / 1000 / 60);
    const seconds = Math.floor((timeMillis / 1000) % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Seek video to the new position when progress bar is dragged
  const onSeek = async (value) => {
    const seekPosition = (value / 100) * duration;
    await videoRef.current.setPositionAsync(seekPosition);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={{ height: screenHeight }}>
        {/* Video container */}

        <Video
          ref={videoRef}
          source={require("../../../../assets/Video/Keuangan.mp4")  }
          style={{ height: screenHeight, width: screenWidth }} // Fullscreen video
          resizeMode="cover"
          onError={(error) => console.error("Video Error:", error)}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate} // Check for when video finishes
        />

        <View
          style={tw`absolute flex-row justify-between w-full h-1.5 mt-4 px-2`}
        >
          {/* Static background bars */}
          <View style={tw`flex-row w-full h-full`}>
            <View style={tw`flex-1 bg-gray-300 mx-1 rounded-full`} />
            <View style={tw`flex-1 bg-gray-300 mx-1 rounded-full`} />
            <View style={tw`flex-1 bg-gray-300 mx-1 rounded-full`} />
            <View style={tw`flex-1 bg-gray-300 mx-1 rounded-full`} />
          </View>
          {/* Moving red progress bar */}
          <View
            style={[
              tw`absolute left-0 h-full bg-red-600 rounded-full`,
              { width: `${progress / 4}%`, maxWidth: "100%" },
            ]}
          />
        </View>

        {/* Play/Pause button on top of the video */}

        {/* Slider and time controls under the video */}
        <View style={tw`absolute bottom-24 left-0 right-0 px-4`}>
          {/* Time display */}
          <View style={tw`flex-row justify-between mb-2 `}>
            <Text style={tw`text-white`}>{formatTime(currentTime)}</Text>
            <Text style={tw`text-white`}>{formatTime(duration)}</Text>
          </View>

          {/* Slider */}
          <Slider
            minimumValue={0}
            maximumValue={100}
            value={progress}
            onSlidingComplete={onSeek}
            minimumTrackTintColor="#BB1624"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#BB1624"
            style={tw`w-full`}
          />
          <View
            style={tw`absolute top-0 left-0 right-0 items-start ml-7 mt-12`}
          >
            <TouchableOpacity
              onPress={togglePlayPause}
              style={tw`flex-row items-center bg-red-600 py-2 px-4 rounded-lg`}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={16}
                color="white"
              />
              <Text style={tw`text-white text-xs ml-2`}>
                {isPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VideoMateriKeuangan;

