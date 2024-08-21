import { View, Text, StyleSheet, Image, FlatList, Dimensions, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import useResponsive from '../Shared/ResponsiveUI';

const MainApp = () => {
  const flatListRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState('');
  const {wp, hp}= useResponsive();

  useEffect(() => {
    const fetchUserFullname = async (uid) => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullname(userData.fullname);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserFullname(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  // data for carousel
  const carouselData = [
    {
      id: '01',
      image: require('./../assets/card2.png'),
    },
    {
      id: '02',
      image: require('./../assets/card1.png'),
    },
    {
      id: '03',
      image: require('./../assets/card3.png'),
    },
  ];

  // display images UI
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{
            height: 500,
            width: screenWidth,
            marginTop: -120,
            marginBottom: -140
          }}
        />
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => (
      <View
        key={index} // Add a unique key to the parent container
        style={{
          flexDirection: 'row', // Assuming you want dots in a row
          alignItems: 'center', // Adjust this based on your layout
        }}
      >
        {activeIndex === index ? (
          <View
            style={{
              backgroundColor: "#7D0A0A",
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 6,
            }}
          ></View>
        ) : (
          <View
            style={{
              backgroundColor: "grey",
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 6,
            }}
          ></View>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeareaview}>
      <ScrollView>
        <StatusBar />
        <View style={styles.card}>
          <Image
            source={require("./../assets/TanpaBackgroundSaraya.png")}
            style={{
              height: 30,
              width: 30,
              marginTop: -100,
              marginHorizontal: -100,
            }}
          />
        </View>
        <View>
          <Text style={styles.textcard}>Halo, {fullname} !</Text>
          <Ionicons
            name="information-circle"
            size={24}
            color="white"
            style={{ marginTop: -58, marginLeft: 370 }}
            onPress={() => navigation.navigate("faq")}
          />
        </View>
        <View>
          <FlatList
            data={carouselData}
            showsHorizontalScrollIndicator={false}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled={true}
            onScroll={handleScroll}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {renderDotIndicators()}
          </View>
        </View>
        <Text style={styles.texth1}>Program Edukasi</Text>
        <View style={{ flexDirection: "row" }}>
          <Pressable style={styles.boxcontainer} onPress={() => navigation.navigate("ads")}>
            <Image
              source={require("./../assets/fund.png")}
              style={styles.imgbox}
            />
            <Text style={{ textAlign: "center" }} >Ads/Iklan</Text>
          </Pressable>
          <Pressable style={styles.boxcontainer} onPress={() => navigation.navigate("sosmed")}>
            <Image
              source={require("./../assets/Marketing-pana.png")}
              style={styles.imgbox}
            />
            <Text style={{ textAlign: "center" }} >Sosial Branding</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable style={styles.boxcontainer} onPress={() => navigation.navigate("Keuangan")}>
            <Image
              source={require("./../assets/keu.png")}
              style={styles.imgbox}
            />
            <Text style={{ textAlign: "center" }} >Laporan Keuangan</Text>
          </Pressable>
          <View style={styles.boxcontainer}>
            <Image
              source={require("./../assets/Mentor.png")}
              style={styles.imgbox}
            />
            <Text style={{ textAlign: "center" }}>Mentoring</Text>
          </View>
        </View>
        <Text style={styles.texth1}>Kelola Keuangan</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.boxcontainer}>
            <Image
              source={require("./../assets/funding.png")}
              style={styles.imgbox}
            />
            <Text style={{ textAlign: "center" }}>Pendanaan Usaha</Text>
          </View>
          <View style={styles.boxcontainer}>
            <Image
              source={require("./../assets/funding.png")}
              style={styles.imgbox}
            />
            <Text style={{ textAlign: "center" }}>Pendanaan Usaha</Text>
          </View>
        </View>
        <Text style={styles.texth1}>News</Text>
        <Text
          style={{ color: "#7D0a0a", marginTop: -20, marginLeft: 310 }}
          onPress={() => navigation.navigate("other")}
        >
          Lebih Banyak
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Image
              source={require("./../assets/najwashihab.jpg")}
              style={{
                height: 120,
                width: 180,
                borderRadius: 15,
                marginHorizontal: 20,
                marginTop: 10,
              }}
            />
            <Text style={{ textAlign: "center", marginTop: 5, marginLeft: 5, fontWeight: '500' }}>Mengelola Keuangan Ala </Text>
            <Text style={{ textAlign: "center", marginBottom: 20, marginLeft: 5, fontWeight: '500' }}>Najwa Shihab</Text>
          </View>
          <View>
            <Image
              source={require("./../assets/uang.jpg")}
              style={{
                height: 120,
                width: 180,
                borderRadius: 15,
                marginHorizontal: 1,
                marginTop: 10,
              }}
            />
            <Text style={{ textAlign: "center", marginTop: 5, marginLeft: 5, fontWeight: '500' }}>5 Tips Memilih Kredit</Text>
            <Text style={{ textAlign: "center", marginBottom: 20, marginLeft: 5, fontWeight: '500' }}>Usaha Yang Tetap</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default MainApp;

const styles = StyleSheet.create({
  safeareaview:{
    flex: 1, backgroundColor: "#ffff" 
  },
  card: {
    backgroundColor: '#7D0A0A',
    padding: 120,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    flexDirection: 'row'
  },
  textcard: {
    color: 'white',
    marginHorizontal: 30,
    marginTop: -180,
    fontSize: 15,
  },
  texth1: {
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20
  },
  boxcontainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BCBBBB',
    height: 120,
    width: 180,
    marginLeft: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 111,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10
  },
  imgbox: {
    height: 80,
    width: 80,
    marginHorizontal: 45,
    marginTop: 10,
  }
});
