import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../Constants/Colors";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const activeColor = Colors[theme.mode];
  const [timers, setTimers] = useState([]);
  const [timerStates, setTimerStates] = useState({});
  const [completedTimer, setCompletedTimer] = useState(null);
  const timerIntervals = React.useRef({});
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTimers = async () => {
        try {
          const storedTimers = await AsyncStorage.getItem("timers");
          if (storedTimers) {
            console.log(JSON.stringify(storedTimers, null, 2));
            const parsedTimers = JSON.parse(storedTimers);
            setTimers(parsedTimers);

            const initialStates = {};
            parsedTimers.forEach((timer) => {
              initialStates[timer.id] = {
                remaining: timer.duration,
                isRunning: false,
                isCompleted: false,
              };
            });
            setTimerStates(initialStates);
          }
        } catch (error) {
          Alert.alert("Error", "Failed to load timers.");
        }
      };
      fetchTimers();
    }, [])
  );

  const startTimer = (id) => {
    if (timerStates[id].isRunning) return;

    setTimerStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], isRunning: true },
    }));

    timerIntervals.current[id] = setInterval(() => {
      setTimerStates((prev) => {
        const updatedState = { ...prev };
        if (updatedState[id].remaining > 0) {
          updatedState[id].remaining -= 1;
        } else {
          updatedState[id].isRunning = false;
          updatedState[id].isCompleted = true;
          clearInterval(timerIntervals.current[id]);
          const completedTimer = timers.find((t) => t.id === id);
          setCompletedTimer(completedTimer);

          const updatedTimers = timers.map((timer) =>
            timer.id === id ? { ...timer, isCompleted: true } : timer
          );
          setTimers(updatedTimers);
          AsyncStorage.setItem("timers", JSON.stringify(updatedTimers)).catch(
            () =>
              Alert.alert(
                "Error",
                "Failed to update timer completion in storage."
              )
          );
        }
        return updatedState;
      });
    }, 1000);
  };

  const pauseTimer = (id) => {
    if (!timerStates[id].isRunning) return;

    clearInterval(timerIntervals.current[id]);
    timerIntervals.current[id] = null;

    setTimerStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], isRunning: false },
    }));
  };

  const resetTimer = (id) => {
    clearInterval(timerIntervals.current[id]);
    timerIntervals.current[id] = null;

    const originalDuration = timers.find((timer) => timer.id === id).duration;
    setTimerStates((prev) => ({
      ...prev,
      [id]: {
        remaining: originalDuration,
        isRunning: false,
        isCompleted: false,
      },
    }));
  };

  const startAllTimersInCategory = (category) => {
    const categoryTimers = timers.filter(
      (timer) => timer.category === category
    );
    categoryTimers.forEach((timer) => startTimer(timer.id));
  };

  const pauseAllTimersInCategory = (category) => {
    const categoryTimers = timers.filter(
      (timer) => timer.category === category
    );
    categoryTimers.forEach((timer) => pauseTimer(timer.id));
  };

  const resetAllTimersInCategory = (category) => {
    const categoryTimers = timers.filter(
      (timer) => timer.category === category
    );
    categoryTimers.forEach((timer) => resetTimer(timer.id));
  };

  // Group timers by category
  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const renderTimerItem = ({ item }) => {
    const timerState = timerStates[item.id] || {
      remaining: item.duration,
      isRunning: false,
      isCompleted: false,
    };
    const progress =
      ((item.duration - timerState.remaining) / item.duration) * 100;

    return (
      <View style={styles.timerSection}>
        <View style={styles.timerItem}>
          <Text style={styles.timerText}>Name: {item.name}</Text>
          <Text style={styles.timerText}>
            Time Remaining: {timerState.remaining} seconds
          </Text>
          {timerState.isCompleted && (
            <Text style={styles.completedText}>Status: Completed</Text>
          )}
        </View>
        <View style={styles.controlsSection}>
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => pauseTimer(item.id)}>
              <AntDesign name="pausecircle" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTimer(item.id)}>
              <MaterialIcons name="not-started" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => resetTimer(item.id)}>
              <MaterialCommunityIcons name="restart" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.progressText}>
            Progress: {Math.round(progress)}%
          </Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: activeColor.background,
    },
    categoryContainer: {
      backgroundColor: "#f5f5f5",
      margin: "3%",
      padding: "3%",
      borderRadius: 5,
      borderWidth: 1,
    },
    categoryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryTitle: {
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      color: "black",
    },
    bulkControls: {
      flexDirection: "row",
      gap: 10,
    },
    bulkButton: {
      backgroundColor: "#007AFF",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 5,
    },
    bulkButtonText: {
      color: "white",
      fontSize: 12,
    },
    timerSection: {
      flexDirection: "row",
      marginTop: 20,
    },
    timerItem: {
      flex: 1,
    },
    timerText: {
      fontSize: 14,
      color: "black",
      fontFamily: "Roboto-Regluar",
    },
    controlsSection: {
      flex: 1,
      flexDirection: "column-reverse",
      justifyContent: "space-between",
    },
    controls: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    progressText: {
      textAlign: "center",
      fontSize: 12,
      fontFamily: "Roboto-Regular",
    },
    completedText: {
      color: "green",
      fontFamily: "Roboto-bold",
    },
    addButton: {
      backgroundColor: activeColor.buttonBackground,
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      margin: 10,
    },
    addButtonText: {
      color: activeColor.reverseTypo,
      fontSize: 16,
      fontFamily: "Roboto-Medium",
    },
    emptyState: {
      alignItems: "center",
      marginTop: 50,
    },
    emptyText: {
      fontSize: 16,
      color: "#666",
    },
    modalOverlay: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: Dimensions.get("window").width / 1.2,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    modalTitle: {
      fontFamily: "Roboto-Medium",
      fontSize: 14,
      color: "black",
    },
    modalText: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: "black",
    },
    modalButtonText: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: "black",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} headertitle={"Home"} />
      <Modal visible={!!completedTimer} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Congratulations! 🎉</Text>
            <Text style={styles.modalText}>
              {completedTimer?.name} timer has completed!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setCompletedTimer(null)}
            >
              <Text style={styles.modalButtonText}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        style={{ borderWidth: 1 }}
        data={Object.keys(groupedTimers)}
        keyExtractor={(category) => category}
        renderItem={({ item: category, index }) => {
          const isExpanded = expandedCategories[category];
          const categoryTimers = groupedTimers[category];
          return (
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => toggleCategory(category)}
                style={styles.categoryHeader}
              >
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={{ flexDirection: "row", gap: 40 }}>
                  <View style={styles.bulkControls}>
                    <TouchableOpacity
                      onPress={() => pauseAllTimersInCategory(category)}
                    >
                      <AntDesign name="pausecircle" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => startAllTimersInCategory(category)}
                    >
                      <MaterialIcons
                        name="not-started"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => resetAllTimersInCategory(category)}
                    >
                      <MaterialCommunityIcons
                        name="restart"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.expandIcon}>
                    {isExpanded ? "-" : "+"}
                  </Text>
                </View>
              </TouchableOpacity>
              {isExpanded && (
                <FlatList
                  data={categoryTimers}
                  keyExtractor={(timer) => timer.id}
                  renderItem={renderTimerItem}
                />
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No timers added yet.</Text>
          </View>
        }
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("AddTimer")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add Timer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("History")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>View History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
