import { View, Text, useColorScheme } from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
// import "./i18n"; // This line imports the i18n configuration
import { ThemeContext } from "./src/Contexts/ThemeContext";
import AppNavigator from "./src/AppNavigator";

const App = () => {
  const defaultTheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  const [theme, setTheme] = useState({ mode: defaultTheme });

  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    setTheme(newTheme);
  };

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {/* <Provider store={store}> */}
      {/* <View style={{ zIndex: 100000 }}>
          <Toast />
        </View> */}
      <AppNavigator />
      {/* </Provider> */}
    </ThemeContext.Provider>
  );
};

export default App;
