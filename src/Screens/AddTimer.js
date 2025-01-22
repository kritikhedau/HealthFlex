import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../Constants/Colors";
import { ThemeContext } from "../Contexts/ThemeContext";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddTimer = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const activeColor = Colors[theme.mode];

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");

  const addTimer = async () => {
    if (!name || !duration || !category) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (isNaN(duration) || parseInt(duration) <= 0) {
      Alert.alert("Error", "Duration must be a positive number.");
      return;
    }

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      category,
    };

    try {
      // Retrieve existing timers, if any
      const storedTimers = await AsyncStorage.getItem("timers");
      const timers = storedTimers ? JSON.parse(storedTimers) : [];

      // Append the new timer
      const updatedTimers = [...timers, newTimer];
      await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));

      // Clear inputs
      setName("");
      setDuration("");
      setCategory("");
      Alert.alert("Success", "Timer added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save the timer.");
    }
  };
  const styles = StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: activeColor.background,
    },

    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
    },
    timerItem: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 5,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    timerText: {
      fontSize: 16,
    },
    pressableButton: {
      backgroundColor: activeColor.buttonBackground,
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      margin: 10,
    },
    buttonText: {
      color: activeColor.reverseTypo,
      fontSize: 16,
      fontFamily: "Roboto-Medium",
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} headertitle={"Add timer"} />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (in seconds)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <Pressable
        onPress={() => {
          addTimer();
        }}
        style={styles.pressableButton}
      >
        <Text style={styles.buttonText}>Add Timer</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default AddTimer;
