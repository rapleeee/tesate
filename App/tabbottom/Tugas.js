import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Tugas() {
  const [materials, setMaterials] = useState([]);
  const navigation = useNavigation();
  const [isChecked, setChecked] = useState({
    1: false,
    2: false,
    3: false,
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      const querySnapshot = await getDocs(collection(db, 'materials'));
      const materialsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterials(materialsList);
    };
    fetchMaterials();
  }, []);

  const handleCheckboxPress = (id) => {
    setChecked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar />
        <View>
          <Image
            source={require("./../assets/Logo.png")}
            style={{ height: 30, width: 30, margin: 20 }}
          />
        </View>
        <View>
          <Text style={styles.text}>Materi Edukasi</Text>
          <AntDesign
            name="exclamationcircleo"
            size={17}
            color="#7D0A0A"
            style={{ marginTop: -18, marginHorizontal: 120 }}
            onPress={() => navigation.navigate("edu")}
          />
          <Text style={styles.text1}>
            Yuk selesaiin materi edukasinya biar makin pinter!
          </Text>
        </View>
        
        {/* Existing materials */}
        <View style={styles.cardMateri}>
          <Text onPress={() => navigation.navigate("Keuangan")}>Materi Laporan Keuangan</Text>
          <View>
            <TouchableOpacity onPress={() => handleCheckboxPress(1)}>
              <View style={styles.checkbox}>
                <AntDesign name={isChecked[1] && "checksquare"} size={22} color="#7d0a0a" style={{ marginTop: -1 }}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardMateri}>
          <Text onPress={() => navigation.navigate("sosmed")}>Sosial Media Branding</Text>
          <View>
            <TouchableOpacity onPress={() => handleCheckboxPress(2)}>
              <View style={styles.checkbox}>
                <AntDesign name={isChecked[2] && "checksquare"} size={22} color="#7d0a0a" style={{ marginTop: -1 }}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.cardMateri}>
          <Text onPress={() => navigation.navigate("ads")}>Ads/Iklan</Text>
          <View>
            <TouchableOpacity onPress={() => handleCheckboxPress(3)}>
              <View style={styles.checkbox}>
                <AntDesign name={isChecked[3] && "checksquare"} size={22} color="#7d0a0a" style={{ marginTop: -1 }}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* New materials from Firestore */}
        {materials.map(material => (
          <View key={material.id} style={styles.cardMateri}>
            <Text onPress={() => navigation.navigate("detailMateri", { material })}>{material.title}</Text>
            {/* <Text>{material.subTitle}</Text> */}
            <View>
              <TouchableOpacity onPress={() => handleCheckboxPress(material.id)}>
                <View style={styles.checkbox}>
                  <AntDesign name={isChecked[material.id] && "checksquare"} size={22} color="#7d0a0a" style={{ marginTop: -1 }}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text:{
    marginLeft:20,
    color:'#7D0A0A',
    marginTop:-15,
    fontWeight:'500'
  },
  text1:{
    marginLeft:20,
    color:'#111',
    fontWeight:'300',
    marginBottom:30
  },
  cardMateri:{
    padding:10,
    backgroundColor:'transparent',
    margin:20,
    marginTop:-10,
    borderRadius:5,
    borderWidth:1,
    borderColor:'grey',
  },
  checkbox:{
    height: 24,
    width: 24,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: "#7d0a0a",
    alignItems: "center",
    justifyContent: "center",
    marginTop:-20,
    marginHorizontal:335
  }
});
