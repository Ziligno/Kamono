import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { theme } from "../core/theme";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextInput from "../components/TextInput";

export default function ProfileView({ navigation }) {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selfie, setselfie] = useState(null);
  const [uidValue, setUidValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDateTime] = useState("");

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

  const showDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    var finalObject =
      date + "/" + month + "/" + year + "    " + hours + ":" + min;
    console.log(finalObject);
    setDateTime(finalObject);
  };
  async function fetchFromFireStore() {
    firestore()
      .collection("Users")
      .where("userID", "==", uidValue)
      .get()
      .then((response) => {
        response.forEach((res) => {
          console.log("getting response as --->", res.data().firstName);
          console.log("getting response as --->", res.data().SELFIE);
          setselfie(res.data().SELFIE);
          setName(res.data().firstName + " " + res.data().lastName);
          setFirstName(res.data().firstName);
          setLastName(res.data().lastName);
        });
      })
      .catch((e) => {
        console.log("error at ---> ", e);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchFromFireStore();
  }, [uidValue]);

  useEffect(() => {
    showDate();
  }, [date]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ height: "100%", width: "100%" }}
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
          onPress={() => navigation.goBack()}
          name="home"
          size={35}
          color="#fff"
          style={{ width: 30 }}
        />
        <Icon
          name="account-circle"
          size={35}
          color="#fff"
          style={{ marginLeft: 230 }}
        />
      </View>

      <View
        style={{
          width: "100%",
          marginTop: 50,
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 50,
            backgroundColor: "#5facdb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selfie == null ? (
            <Image
              source={require("../assets/profile.jpg")}
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "contain",
                borderRadius: 50,
                backgroundColor: "#5facdb",
              }}
            />
          ) : (
            <Image
              source={{ uri : selfie}}
              style={{
                height: "100%",
                width: "100%",
                // resizeMode: "contain",
                borderRadius: 50,
                backgroundColor: "#5facdb",
              }}
            />
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 40,
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontFamily: "RobotoBold",
            color: "#FFF",
            textAlign: "center",
          }}
        >
          {name}
        </Text>
      </View>
      <Text
        style={{
          paddingHorizontal: 40,
          color: "#fff",
          fontSize: 18,
          fontFamily: "RobotoRegular",
        }}
      >
        {date}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 50,
          marginTop: 60,
        }}
      ></View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginVertical: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            paddingHorizontal: 32,
            alignSelf: "center",
            marginTop: 10,
            backgroundColor: "#FFF",
            height: 182,
            elevation: 1,
            width: 270,
            borderRadius: 16,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "RobotoBold",
                color: "#4b3ca7",
                fontSize: 20,
              }}
            >
              First Name: {firstName}
            </Text>
            <Text
              style={{
                fontFamily: "RobotoBold",
                color: "#4b3ca7",
                fontSize: 20,
                marginTop: "10%",
              }}
            >
              Last Name: {lastName}
            </Text>
          </View>
        </TouchableOpacity>
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
                marginTop: 290,
                backgroundColor: "#FFF",
                height: 350,
                elevation: 1,
                width: 270,
                borderRadius: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "20%",
                }}
              >
                <TextInput
                  label="First Name"
                  returnKeyType="done"
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                />
                <TextInput
                  label="Last Name"
                  returnKeyType="done"
                  value={lastName}
                  onChangeText={(text) => setFirstName(text)}
                />
              </View>

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
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text
                  style={{
                    fontFamily: "RobotoBold",
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  Update
                </Text>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  text: {
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 30,
    color: "#ffffff",
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  profileDetail: {
    alignSelf: "center",
    marginTop: "5%",
    alignItems: "center",
    flexDirection: "row",
  },
  detailContent: {
    margin: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#00CED1",
  },
  count: {
    fontSize: 18,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    marginTop: 40,
  },
  textInfo: {
    fontSize: 18,
    marginTop: 20,
    color: "#696969",
  },
  buttonContainer: {
    marginTop: "5%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  description: {
    fontSize: 20,
    color: "#00CED1",
    marginTop: 10,
    textAlign: "center",
  },
});
