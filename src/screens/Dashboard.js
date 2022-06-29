import React, { useState, useEffect } from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  TextInput,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Modal,
  TouchableHighlight,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard({ navigation }) {
  const [name, setName] = useState("");
  const [uidValue, setUidValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [news, setNews] = useState("");

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

  const removeData = async () => {
    try {
      const value = await AsyncStorage.removeItem("Uid");
      if (value !== null) {
        setUidValue(null);
        console.log("value reviosly stored is ...", value);
      }
    } catch (e) {
      // error reading value
    }
  };
  async function fetchFromFireStore() {
    firestore()
      .collection("Users")
      .where("userID", "==", uidValue)
      .get()
      .then((response) => {
        response.forEach((res) => {
          setName(res.data().firstName);
        });
      })
      .catch((e) => {
        console.log("error at ---> ", e);
      });
    firestore()
      .collection("News")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          setNews(documentSnapshot.data().update.toString());
        });
      });
    console.log(news);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchFromFireStore();
  }, [uidValue]);
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ width: "100%", height: "100%" }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: 40,
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <Icon
          onPress={() => setModalVisible(!modalVisible)}
          name="menu"
          size={40}
          color="#fff"
          style={{ width: 30 }}
        />
        <Icon
          onPress={() => navigation.navigate("ProfileScreen")}
          name="account-circle"
          size={36}
          color="#fff"
          style={{ marginLeft: 230 }}
        />
      </View>

      <View style={{ paddingHorizontal: 40, marginTop: 25 }}>
        <Text
          style={{
            fontSize: 40,
            color: "#fff",
            fontFamily: "RobotoBold",
          }}
        >
          Hello {name}
        </Text>

        <Text
          style={{
            fontSize: 16,
            paddingVertical: 10,
            paddingRight: 80,
            lineHeight: 22,
            fontFamily: "RobotoRegular",
            color: "#fff",
          }}
        >
          Welcome to the Kamono Farm Initiative App
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginRight: -40, marginTop: 30 }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 80,
              width: 80,
              borderRadius: 50,
              backgroundColor: "#ff5c83",
              marginHorizontal: 22,
            }}
          >
            <Icon
              onPress={() => navigation.navigate("ContractsScreen")}
              name="cart"
              color="white"
              size={35}
            />
            <Text style={{ color: "#fff", fontWeight: "bold" }}>BUY</Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 80,
              width: 80,
              borderRadius: 50,
              backgroundColor: "#ffa06c",
            }}
          >
            <Icon
              onPress={() => navigation.navigate("MyContracts")}
              name="pin"
              color="white"
              size={35}
            />
            <Text style={{ color: "#fff", fontWeight: "bold" }}>VIEW</Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 80,
              width: 80,
              borderRadius: 50,
              backgroundColor: "#bb32fe",
              marginLeft: 22,
            }}
          >
            <Icon name="dots-horizontal" color="white" size={32} />
          </View>
        </ScrollView>

        <Text
          style={{
            color: "#FFF",
            fontFamily: "RobotoRegular",
            marginTop: 50,
            fontSize: 18,
          }}
        >
          Latest News
        </Text>

        <View
          style={{
            backgroundColor: "#FEFEFE",
            height: 200,
            width: "90%",
            marginTop: "10%",
            borderRadius: 15,
            padding: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  padding: 10,
                  color: "#000",
                }}
              >
                {news}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Modal
            onPress={() => console.log("close")}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal is closed");
            }}
          >
            <View
              style={{
                paddingHorizontal: 32,
                alignSelf: "center",
                marginTop: "20%",
                backgroundColor: "#FFF",
                height: "30%",
                elevation: 1,
                width: 270,
                borderRadius: 15,
              }}
            >
              <Text
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  fontSize: 22,
                  color: "#000",
                  fontFamily: "RobotoBold",
                  fontWeight: "bold",
                  textAlign: "right",
                  marginTop: "5%",
                  marginBottom: "5%",
                }}
              >
                X
              </Text>
              <TouchableHighlight
                underlayColor="#6600bb"
                style={{
                  width: 200,
                  marginLeft: 5,
                  elevation: 2,
                  backgroundColor: "#44FEA1",
                  paddingVertical: 13,
                  borderRadius: 25,
                  alignSelf: "center",
                }}
                onPress={() => {
                  navigation.navigate("CalculatorScreen");
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "RobotoBold",
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  Investment Calculator
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="#6600bb"
                style={{
                  width: 200,
                  marginLeft: 5,
                  elevation: 2,
                  marginTop: 25,
                  backgroundColor: "#44FEA1",
                  paddingVertical: 13,
                  borderRadius: 25,
                  alignSelf: "center",
                }}
                onPress={() => {
                  removeData();
                  setModalVisible(!modalVisible);
                  navigation.replace("StartScreen");
                }}
              >
                <Text
                  style={{
                    fontFamily: "RobotoBold",
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  Log Out
                </Text>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  cardView: {
    width: "100%",
    height: "15%",
    marginTop: "10%",
    alignItems: "center",
    padding: 20,
  },
});
