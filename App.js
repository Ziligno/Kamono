import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from "./src/screens";
import ProfileScreen from "./src/screens/ProfileScreen";
import Contracts from "./src/screens/Contracts";
import PurchaseContractsScreen from "./src/screens/PurchaseContractScreen";
import MyContracts from "./src/screens/MyContracts";
import UploadImageScreen from "./src/screens/UploadImage";
import Calculate from "./src/screens/Calculator";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="StartScreen"
            component={StartScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CalculatorScreen"
            component={Calculate}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="UploadImageScreen"
            component={UploadImageScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ContractsScreen"
            component={Contracts}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PurchaseContractsScreen"
            component={PurchaseContractsScreen}
            screenOptions={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyContracts"
            component={MyContracts}
            screenOptions={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
