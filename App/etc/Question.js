import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

export default function Question() {
  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar/>
        <View>
          <Text>Faq</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}