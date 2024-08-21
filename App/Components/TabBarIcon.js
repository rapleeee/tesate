import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const TabBarIcon = ({ iconName, label, focused, additionalStyle = {} }) => {
  let IconComponent;

  if (iconName === 'newspaper') {
    IconComponent = FontAwesome5;
  } else if (iconName.includes('account') || iconName.includes('briefcase')) {
    IconComponent = MaterialCommunityIcons;
  } else {
    IconComponent = FontAwesome;
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 5, ...additionalStyle }}>
      <IconComponent name={iconName} size={24} color={focused ? "#7D0A0A" : "grey"} />
      <Text style={{ fontSize: 12, color: focused ? "#7d0a0a" : "grey" }}>{label}</Text>
    </View>
  );
};

export default TabBarIcon;
