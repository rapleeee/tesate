import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Start from '../pages/Start';
import Signup from '../pages/Signup';
import Main from '../pages/Main';
import Singin from "../pages/Singin";
import Akun from "../tabbottom/Akun";
import Tugas from "../tabbottom/Tugas";
import News from "../tabbottom/News";
import LaporanKeuangan from "../tabbottom/LaporanKeuangan";
import Question from "../etc/Question";
import AdminPanel from "../pages/AdminPanel";
import TabBarIcon from "../Components/TabBarIcon";
import EditAccount from "../Services/EditAccount";
import NilaiUang from "../etc/Kuis/level1/NilaiUang";
import DetailOrders from "../orders/DetailOrders";
import CardOrders from "../orders/CardOrders";

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
        borderWidth: 4,
        borderColor: "#E3E3E3",
        backgroundColor: "#5CB85C",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const UserNavigation = () => {

  const MainApp = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          style: {
            ...styles.shadow,
            position: "absolute",
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            borderRadius: 15,
            height: 90,
          },
        }}
      >
        <Tab.Screen
          name="Main"
          component={Main}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon iconName="home" label="Beranda" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="leaderboard"
          component={News}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                iconName="information-circle"
                label="Informasi"
                focused={focused}
                additionalStyle={{ marginRight: 15 }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="cardOrders"
          component={CardOrders}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons name="cart" size={34} color="#E3E3E3" />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          }}
        />
        

        <Tab.Screen
          name="notification"
          component={Question}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                iconName="notifications"
                label="Notifikasi"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="akun"
          component={Akun}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                iconName="account-circle"
                label="Akun"
                focused={focused}
              />
            ),
          }}
        />
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
        <Stack.Screen name="notification" component={Question}/>
        <Stack.Screen name="news" component={News}/>
        <Stack.Screen name="adminPanel" component={AdminPanel}/>
        <Stack.Screen name="editAccount" component={EditAccount}/>
        <Stack.Screen name="detailOrders" component={DetailOrders}/>
        <Stack.Screen name="cardOrders" component={CardOrders}/>

        
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
