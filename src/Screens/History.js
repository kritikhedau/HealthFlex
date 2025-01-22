import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import { Colors } from "../Constants/Colors";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const History = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const activeColor = Colors[theme.mode];

  const [completedTimers, setCompletedTimers] = useState([]);

  // Fetch timers and filter completed ones
  useEffect(() => {
    const fetchCompletedTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem("timers");
        if (storedTimers) {
          const timers = JSON.parse(storedTimers);
          const filteredTimers = timers.filter((timer) => timer.isCompleted);
          setCompletedTimers(filteredTimers);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load completed timers.");
      }
    };

    fetchCompletedTimers();
  }, []);

  // Render completed timer item
  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Name: {item.name}</Text>
      <Text style={styles.historyText}>Duration: {item.duration} seconds</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{ height: "100%", backgroundColor: activeColor.background }}
    >
      <Header navigation={navigation} headertitle={"History"} />
      <FlatList
        data={completedTimers}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No completed timers yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default History;

// Styles for the History screen
const styles = StyleSheet.create({
  historyItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  historyText: {
    fontSize: 16,
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
