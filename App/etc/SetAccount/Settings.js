import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {    
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={{backgroundColor:'darkred', padding:80}}>
        <Text style={{color:'white', textAlign:'center', marginTop:-60, fontSize:20}}>Account Centre</Text>
      </View>
      <View style={{flexDirection:'row', margin:20, marginBottom:5, marginTop:170}}>
          {/* <MaterialIcons name="shield" size={24} color="black" /> */}
          <Text style={{marginLeft:8, fontWeight:'bold', color:'black'}} onPress={() => navigation.navigate("ChangePassword")}>Change Password</Text>
          <AntDesign name="right" size={15} color="black" style={{marginLeft:235}}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({})