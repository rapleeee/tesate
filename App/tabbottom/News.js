import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';

const News = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <StatusBar />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#787879" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <TouchableOpacity>
            <Ionicons name="alert-circle-outline" size={24} color="#BB1624" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Ionicons name="trophy-outline" size={100} color="#fff" style={styles.trophyIcon}/>
            <Text style={styles.cardTitle}>Ambassador Elite</Text>
          </View>
          <View style={styles.countdownContainer}>
            <Ionicons name="timer-outline" size={24} color="#E91E63" />
            <Text style={styles.countdownText}>20:14:00</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabTextActive}>Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabInactive}>
              <Text style={styles.tabTextInactive}>Global</Text>
            </TouchableOpacity>
          </View>

          {/* Ranking List */}
          <View style={styles.rankingContainer}>
            {/* List Item */}
            {["Venus", "Gloria", "Phoebe"].map((name, index) => (
              <View key={index} style={styles.rankingItem}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.pointText}>1875</Text>
                <View style={styles.rewardBox} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default News;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    color: '#787879',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    width: '80%',
    backgroundColor: '#EF980C',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  trophyIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#E91E63',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabActive: {
    flex: 1,
    padding: 10,
    backgroundColor: '#BF3131',
    alignItems: 'center',
    borderRadius: 10,
  },
  tabInactive: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabTextInactive: {
    color: '#787879',
    fontWeight: 'bold',
  },
  rankingContainer: {
    width: '100%',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  rankBadge: {
    width: 30,
    height: 30,
    backgroundColor: '#FFEB3B',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardBox: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#FFC107',
    borderWidth: 1,
    borderRadius: 5,
  },
});
