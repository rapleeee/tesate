import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import CategoryTextSlider from '../Components/CategoryTextSlider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons';
import TopHeadlineSlieder from '../Components/TopHeadlineSlieder'
import HeadlineList from '../Components/HeadlineList'
import GlobalApi from '../Services/GlobalApi'
import { Colors } from 'react-native/Libraries/NewAppScreen'

function News() {
  const [newsList,setNewsList] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
      getTopHeadline();
  },[])

  const getTopHeadline=async()=>{
      const result =(await GlobalApi.getTopHeadline).data;
      setNewsList(result.articles)
  }

  useEffect(()=>{
    getNewsByCategory('latest');
  },[])

  const getNewsByCategory=async(category)=>{
    setLoading(true);
    const result =(await GlobalApi.getByCategory(category)).data;
    setNewsList(result.articles)
    setLoading(false)
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <View style={{ margin: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.appName}>Saraya News</Text>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </View>
        <CategoryTextSlider
          selectCategory={(category) => getNewsByCategory(category)}
        />
        {loading ? (
          <ActivityIndicator size={"large"} color={Colors.darkred} />
        ) : (
          <View>
            <TopHeadlineSlieder newsList={newsList} />
            <HeadlineList newsList={newsList} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: '#7d0a0a',
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default News