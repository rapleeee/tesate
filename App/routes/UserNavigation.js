import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import Start from '../pages/Start';
import Signup from '../pages/Signup';
import Main from '../pages/Main';
import Singin from "../pages/Singin";
import Akun from "../tabbottom/Akun";
import Tugas from "../tabbottom/Tugas";
import News from "../tabbottom/News";
import LaporanKeuangan from "../tabbottom/LaporanKeuangan";
import Question from "../etc/Question";
import Other from "../etc/Other";
import Edu from "../etc/Edu";
import Keuangan from "../etc/Materi/Keuangan";
import SosmedBranding from "../etc/Materi/SosmedBranding";
import Ads from "../etc/Materi/Ads";
import ReadNews from "../etc/ReadNews";
import Settings from "../etc/SetAccount/Settings";
import ChangePassword from "../etc/SetAccount/extra/ChangePassword";
import KuisLaporanKeuangan from "../etc/Kuis/KuisLaporanKeuangan";
import ScoreLaporanKeuangan from "../etc/Kuis/ScoreLaporanKeuangan";
import VideoMateriKeuangan from "../etc/Materi/SubabMateri/Keuangan/VideoMateriKeuangan";
import DasarKeuangan from "../etc/Materi/SubabMateri/Keuangan/DasarKeuangan";
import DasarSosmedBranding from "../etc/Materi/SubabMateri/SosmedBranding/DasarSosmedBranding";
import KuisSosmedBranding from "../etc/Materi/SubabMateri/SosmedBranding/KuisSosmedBranding";
import ScoreSosmedBranding from "../etc/Kuis/ScoreSosmedBranding";
import DasarAds from "../etc/Materi/SubabMateri/AdsIklan/DasarAds";
import VideoAds from "../etc/Materi/SubabMateri/AdsIklan/VideoAds";
import ScoreAdsIklan from "../etc/Kuis/ScoreAdsIklan";
import KuisAds from "../etc/Materi/SubabMateri/AdsIklan/KuisAds";
import AdminPanel from "../pages/AdminPanel";
import DetailMateri from "../etc/DetailMateri";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{ top: -30, justifyContent: "center", alignItems: "center" }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 8,
        borderColor: "#E3E3E3",
        backgroundColor: "#7d0a0a",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const UserNavigation = () => {

  const MainApp = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, style: { ...styles.shadow, position:'absolute', bottom: 25, left: 20, right : 20, elevation: 0, borderRadius: 15, height: 90} }} >
        <Tab.Screen name='Main' component={Main} options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop:5 }}>
            <FontAwesome name="home" size={24} color={focused ? "#7D0A0A" : "grey"} />
            <Text style={{ fontSize: 12, color: focused ? "#7d0a0a" :"grey"}}>Home</Text>
          </View>
        )}}/>
        <Tab.Screen name='tugas' component={Tugas} options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop:5, marginRight:15 }}>
            <FontAwesome6 name="newspaper" size={24} color={focused ? "#7D0A0A" : "grey"} />
            <Text style={{ fontSize: 12, color: focused ? "#7d0a0a" :"grey"}} >Course</Text>
          </View>
        )}}/>

        <Tab.Screen name="LaporanKeuangan" component={LaporanKeuangan} options={{tabBarIcon: ({focused}) => (
          <MaterialCommunityIcons name="bank" size={24} color="#E3E3E3" />), 
          tabBarButton:(props) =>(
            <CustomTabBarButton {...props}/>
          )
          }}/>
        <Tab.Screen name='news' component={News} options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center" , marginTop:5, marginLeft:15}}>
            <Entypo name="news" size={24} color={focused ? "#7D0A0A" : "grey"} />
            <Text style={{ fontSize: 12, color: focused ? "#7d0a0a" :"grey"}}>News</Text>
          </View>
        )}}/>
        <Tab.Screen name='akun' component={Akun} options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center" , marginTop:5}}>
            <MaterialCommunityIcons name="account-circle" size={24} color={focused ? "#7D0A0A" : "grey"} />
            <Text style={{ fontSize: 12, color: focused ? "#7d0a0a" :"grey"}}>Account</Text>
          </View>
        )}}/> 
      </Tab.Navigator>
    );
  };

  return (

      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="start" component={Start} />
        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="signin" component={Singin} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="akun" component={Akun} />
        <Stack.Screen name="tugas" component={Tugas}/>
        <Stack.Screen name="faq" component={Question}/>
        <Stack.Screen name="other" component={Other}/>
        <Stack.Screen name="edu" component={Edu}/>
        <Stack.Screen name="news" component={News}/>
        <Stack.Screen name="LaporanKeuangan" component={LaporanKeuangan}/>
        <Stack.Screen name="Keuangan" component={Keuangan}/>
        <Stack.Screen name="sosmed" component={SosmedBranding}/>
        <Stack.Screen name="ads" component={Ads}/>
        <Stack.Screen name="readnews" component={ReadNews}/>
        <Stack.Screen name="settings" component={Settings}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword}/>
        <Stack.Screen name="kuisLaporanKeuangan" component={KuisLaporanKeuangan}/>
        <Stack.Screen name="kuisAds" component={KuisAds}/>
        <Stack.Screen name="kuisSosmedBranding" component={KuisSosmedBranding}/>
        <Stack.Screen name="scoreLaporanKeuangan" component={ScoreLaporanKeuangan}/>
        <Stack.Screen name="scoreSosmedBranding" component={ScoreSosmedBranding}/>
        <Stack.Screen name="scoreAdsIklan" component={ScoreAdsIklan}/>
        <Stack.Screen name="videoKeuangan" component={VideoMateriKeuangan}/>
        <Stack.Screen name="dasarKeuangan" component={DasarKeuangan}/>
        <Stack.Screen name="dasarIklan" component={DasarAds}/>
        <Stack.Screen name="dasarSosmed" component={DasarSosmedBranding}/>
        <Stack.Screen name="videoAds" component={VideoAds}/>
        <Stack.Screen name="adminPanel" component={AdminPanel}/>
        <Stack.Screen name="detailMateri" component={DetailMateri}/>
        
      </Stack.Navigator>
   
  );
}

export default UserNavigation;

const styles = StyleSheet.create({
  shadow:{
   shadowColor: '#3B4544F0',
   shadowOffset: {
    width: 0,
    height: 10,
   },
   shadowOpacity: 0.25,
   shadowRadius: 13.5,
   elevation: 5
  }
});
