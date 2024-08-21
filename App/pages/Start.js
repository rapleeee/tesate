import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import useResponsive from '../Shared/ResponsiveUI';

export default function Start() {

    const { wp, hp } = useResponsive();
const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container]}>
        <StatusBar/>
        <Image style={{resizeMode:"center", width:430, height:320,marginTop:5}} source={require("./../assets/financial.png")}/>
        <View>
            <Text style={styles.h1}>Saraya Nusantara</Text>
            <Text style={styles.h2}>Edukasi Keuangan Digital Khusus Pelaku Bisnis/UMKM</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("signup")}>
            <Text style={{color:'white'}}>Lets Get Started</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginHorizontal:110, marginTop:5}}>
        <Text>Already Have Account?</Text>
        <Text style={{ marginHorizontal:3, textDecorationLine:'underline', color:'blue'}} onPress={() => navigation.navigate("signin")}>Sign In</Text>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#ffff"
    },
    h1:{
        fontWeight:'bold',
        textAlign:'center',
        fontSize: 42,
        color: '#BF3131',
    },
    h2:{
        marginTop: 15,
        textAlign:'center',
        fontSize: 20,
        color:'grey'
    },
    button:{
        backgroundColor:'#BF3131',
        padding:12,
        marginTop:130,
        marginHorizontal:70,
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30
    }
})