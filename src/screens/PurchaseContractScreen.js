import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import Icon from "@expo/vector-icons/Ionicons";
import CardView from "react-native-cardview";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Header from "../components/Header";
import { theme } from "../core/theme";
import firestore from "@react-native-firebase/firestore";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export default function PurchaseContractsScreen({ route, navigation }) {
  const { params } = route;
  const { ID, Price, contractType, Duration, Payout } = params;
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [msisdn, setMsisdn] = useState("");
  const [error, setError] = useState("");
  const [uidValue, setUidValue] = useState("");
  const [date, setDateTime] = useState("");
  const [slots, setSlots] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(Price);

  const showDate = () => {
    var date = moment(new Date()).format("YYYY-MM-DD");
    setDateTime(date);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Uid");
      if (value !== null) {
        setUidValue(value);
        console.log("value reviosly stored is ...", value);
      }
    } catch (e) {
      console.log("value reviosly stored is ...", e);
    }
  };

  useEffect(() => {
    showDate();
  }, []);
  useEffect(() => {
    getData();
  }, []);
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!successModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={{
                height: "60%",
                margin: 20,
                backgroundColor: "white",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text
                onPress={() => setSuccessModalVisible(false)}
                style={styles.closeModal}
              >
                X
              </Text>
              <Image
                source={require("../assets/success.png")}
                style={styles.image}
              />
              <Text style={{ fontSize: 21, marginTop: "5%", color: "green" }}>
                Transaction Complete !
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                onPress={() => setModalVisible(false)}
                style={styles.closeModal}
              >
                X
              </Text>
              <Text style={styles.modalText}>Please Enter Mobile Number</Text>

              <View style={{ width: "90%", marginBottom: "10%" }}>
                <TextInput
                  label="Mobile Number"
                  returnKeyType="next"
                  value={msisdn}
                  onChangeText={(text) => setMsisdn(text)}
                />
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : (
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => makePayment()} // setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </Pressable>
              )}
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        </Modal>
        <Header
          style={{
            fontSize: 21,
            color: theme.colors.accent,
            fontWeight: "bold",
            paddingVertical: 10,
            textAlign: "center",
          }}
        >
          Purchase Contract
        </Header>
        <BackButton goBack={navigation.goBack} />

        <View flexDirection="row">
          <CardView
            cardElevation={0}
            cardMaxElevation={0}
            cornerRadius={10}
            style={styles.card}
          >
            <View>
              <Text style={{ ...styles.text, marginTop: 20 }}>
                {contractType}
              </Text>
              <Text style={{ ...styles.text }}>Price: K{price}</Text>
              <Text style={styles.text}>Slots: {slots}</Text>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                onPress={() => increaseSlots()}
                name="add-circle-outline"
                size={40}
                color="#000"
                style={{ width: 40, marginLeft: "80%" }}
              />
              <Icon
                onPress={() => decreaseSlots()}
                name="md-remove-circle-outline"
                size={36}
                color="#000"
                style={{ position: "absolute", left: "10%" }}
              />
            </View>
          </CardView>
        </View>
        {/* <Button
          mode="contained"
          onPress={() => {}}
          style={{
            marginTop: 24,
            borderRadius: 20,
            width: "90%",
            alignSelf: "center",
          }}
        >
          Proceed
        </Button> */}
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setModalVisible(true)}
        >
          <Image
            style={styles.images}
            source={require("../assets/zamtel.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => console.log("Airtel")}
        >
          <Image
            style={styles.images}
            source={require("../assets/airtel.jpg")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => console.log("MTN")}
        >
          <Image style={styles.images} source={require("../assets/mtn.jpg")} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  function increaseSlots() {
    let slot = slots + 1;
    let priceToPay = Number(price) + Number(Price);
    console.log("-----> ", slot, " ----- ", priceToPay);
    setPrice(priceToPay);
    setSlots(slot);
  }
  function decreaseSlots() {
    if (slots > 1) {
      let slot = slots - 1;
      let priceToPay = Number(price) - Number(Price);
      if (priceToPay == 0) {
        setPrice(Price);
      }
      console.log("-----> ", slot, " ----- ", priceToPay);
      console.log("-----> ", slot);
      setPrice(priceToPay);
      setSlots(slot);
    }
  }

  async function makePayment() {
    setIsLoading(true);
    var status, transactionID, message;
    var markedDate = moment().add(Duration, "months").calendar();
    const result = await axios
      .get(
        `https://apps.zamtel.co.zm/ZampayRest/Req?
    ConversationId=12552&ThirdPartyID=CllT_Caller&Password=eS8eeP9Td6q5nAcxvty8HCp5i
    TLiQM9/&Amount=${price}&Msisdn=${msisdn}&Shortcode=000088&ConversationId=xx87sxc23`
      )
      .then((response) => {
        message = response.data.message;
        status = response.data.status;
        transactionID = response.data.TransactionId;
        if (response.data.status === "0") {
          console.log(message);
          firestore().collection("Purchases").add({
            purchaseDate: date,
            uuid: uidValue,
            contractType,
            price,
            ID,
            slots,
            transactionID,
            PaymentMode: "Mobile Money",
            PayoutDate: markedDate,
          });
          setModalVisible(false);
          setSuccessModalVisible(true);
          setIsLoading(false);
          setError(null);
        } else {
          console.log(message);
          setError(message);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(message);
        setIsLoading(false);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
    padding: 12,
    paddingTop: 50,
  },
  closeModal: {
    fontSize: 25,
    position: "absolute",
    right: "8%",
    top: "5%",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    marginTop: "5%",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalView: {
    height: "80%",
    margin: 25,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: "20%",
    textAlign: "center",
    fontSize: 18,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: theme.colors.primary,
    width: "70%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  listItem: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 5,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 15,
  },
  imageContainer: {
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "30%",
    width: "100%",
  },
  images: {
    alignSelf: "center",
    width: "75%",
    height: "65%",
    resizeMode: "contain",
  },
  text: {
    textAlign: "center",
    margin: 1,
    height: 75,
    fontSize: 20,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    margin: 10,
    marginTop: 50,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
