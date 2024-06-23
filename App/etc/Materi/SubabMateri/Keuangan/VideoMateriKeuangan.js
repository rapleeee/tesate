import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';

const VideoMateriKeuangan = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <Text style={styles.title}>Video Materi Keuangan</Text>
        <Image 
          source={require('../../../../assets/Keuangan.mp4')}  // 
          style={styles.video}
          controls={true}
          resizeMode="contain"
          onError={(error) => console.error('Video Error:', error)}
          onBuffer={() => console.log('Buffering...')}
        />
      </View>
    </SafeAreaView>
  );
};

export default VideoMateriKeuangan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  videoContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
