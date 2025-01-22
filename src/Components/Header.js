import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useContext } from "react";
import { Colors } from "../Constants/Colors";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { ThemeContext } from "../Contexts/ThemeContext";

export default function Header({ navigation, headertitle }) {
  const { theme, updateTheme } = useContext(ThemeContext);

  let activeColor = Colors[theme.mode];

  const [isSwitchOn, setIsSwitchOn] = React.useState(
    theme.mode == "light" ? false : true
  );
  const onToggleSwitch = () => {
    updateTheme();
    setIsSwitchOn(!isSwitchOn);
  };
  const styles = StyleSheet.create({
    container: {
      height: "100%",
      backgroundColor: activeColor.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "3%",
      borderBottomWidth: 1,
      borderBottomColor: "gray",
    },
    headerText: {
      color: activeColor.typography,
      fontFamily: "Roboto-Medium",
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
    <View style={styles.header}>
      {headertitle !== "Home" ? (
        <EvilIcons
          onPress={() => {
            navigation.goBack();
          }}
          name="arrow-left"
          size={24}
          color={activeColor.typography}
        />
      ) : null}
      <Text style={styles.headerText}>{headertitle}</Text>
      <Pressable
        onPress={() => {
          onToggleSwitch();
        }}
      >
        {theme.mode == "light" ? (
          <Feather name="sun" size={24} color={activeColor.typography} />
        ) : (
          <Feather name="moon" size={24} color={activeColor.typography} />
        )}
      </Pressable>
    </View>
  );
}
