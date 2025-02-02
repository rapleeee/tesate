import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; // Tambahkan import ini

const TabBarIcon = ({ iconName, label, focused, additionalStyle = {} }) => {
  let IconComponent;

  if (iconName === 'newspaper') {
    IconComponent = FontAwesome5;
  } else if (iconName.includes('account') || iconName.includes('home')) {
    IconComponent = MaterialCommunityIcons;
  } else if (iconName === 'leaderboard' || iconName === 'edit') {
    IconComponent = MaterialIcons;
  } else if (iconName === 'information-circle') {
    IconComponent = Ionicons; // Gunakan Ionicons untuk information-circle
  } else {
    IconComponent = FontAwesome6;
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 5, ...additionalStyle }}>
      <IconComponent name={iconName} size={24} color={focused ? "#5CB85C" : "grey"} />
      <Text style={{ fontSize: 11, color: focused ? "#5CB85C" : "grey" }}>{label}</Text>
    </View>
  );
};

export default TabBarIcon;
