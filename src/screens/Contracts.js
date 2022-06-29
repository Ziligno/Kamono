import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { theme } from "../core/theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function Contracts({ navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore()
      .collection("Contracts")
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          console.log("-======> ", documentSnapshot.data());
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ width: "100%", height: "100%" }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: "5%",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-left"
          size={40}
          color="#fff"
          style={{ width: 40 }}
        />
      </View>
      <View style={{ paddingHorizontal: 40, marginTop: 10 }}>
        <Text
          style={{
            fontSize: 25,
            color: "#fff",
            fontFamily: "RobotoBold",
            textAlign: "center",
          }}
        >
          Purchase Contracts
        </Text>
      </View>

      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => actionOnRow(item)}>
            <View style={styles.listItem}>
              <Text style={styles.text}>{item.type}</Text>
              <Text style={styles.text}>Price: K {item.Price}</Text>
              <Text style={styles.text}>Pay Out: K {item.Payout}</Text>
              <Text style={styles.text}>Maturity: {item.Duration} Months</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </ImageBackground>
  );

  function actionOnRow(item) {
    navigation.navigate("PurchaseContractsScreen", {
      contractType: item.type,
      ID: item.ID,
      Price: item.Price,
      Duration: item.Duration,
      Payout: item.Payout,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    paddingTop: 100,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 15,
    width: "95%",
    alignSelf: "center",
  },
  text: {
    fontSize: 20,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "bold",
  },
});
