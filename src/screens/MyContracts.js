import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { theme } from "../core/theme";
import Logo from "../components/Logo";
import BackButton from "../components/BackButton";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyContracts({ navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [uidValue, setUidValue] = useState("");

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Uid");
      if (value !== null) {
        setUidValue(value);
        console.log("value reviosly stored is ...", value);
      }
    } catch (e) {
      // error reading value
    }
  };

  const fetchFromFirebase = async () => {
    const users = [];
    console.log("contracts fetched -----> ", uidValue);
    const subscriber = firestore()
      .collection("Purchases")
      .where("uuid", "==", uidValue)
      .onSnapshot((querySnapshot) => {
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
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchFromFirebase();
  }, [uidValue]);

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
          My Contracts
        </Text>
      </View>
      {users.length == 0 ? (
        <Text
          style={{
            fontSize: 25,
            color: "#fff",
            fontFamily: "RobotoBold",
            textAlign: "center",
            marginTop: "50%",
          }}
        >
          You currently have no pending contracts
        </Text>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback>
              <View style={styles.listItem}>
                <Text style={styles.text}>
                  Reciept No: {item.transactionID}
                </Text>
                <Text style={styles.text}>
                  Contract Type:{item.contractType}
                </Text>
                <Text style={styles.text}>
                  Date of Purchase: {item.purchaseDate}
                </Text>
                <Text style={styles.text}>
                  Maturity Date: {item.PayoutDate}
                </Text>
                <Text style={styles.text}>Price K {item.Price}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    paddingTop: 100,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 5,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 15,
  },
  text: {
    fontSize: 20,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "bold",
  },
});
