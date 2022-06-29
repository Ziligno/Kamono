import "react-native-gesture-handler";
import React, { useState, useEffect, Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import TextInputMask from "react-native-text-input-mask";
import firestore from "@react-native-firebase/firestore";

function Calculator({ navigation }) {
  const [apiData, setApiData] = useState([]);

  const [billPaymentAmount, setBillPaymentAmount] = useState({});
  const [selectedBill, setSelectedBill] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);

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

        setApiData(users);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const computeBillPaymentAmount = () => {
    let newBillPaymentAmount = {};

    apiData.forEach(({ ID, Payout }) => {
      newBillPaymentAmount[ID] = Payout;
    });

    return newBillPaymentAmount;
  };

  const computeTotalPaymentAmount = () => {
    let total = 0;

    selectedBill.forEach((ID) => {
      total += parseFloat(billPaymentAmount[ID]);
    });

    return total ? total : 0;
  };

  useEffect(() => {
    setBillPaymentAmount(computeBillPaymentAmount());
  }, [apiData]);

  useEffect(() => {
    setTotalPaymentAmount(computeTotalPaymentAmount());
  }, [selectedBill, billPaymentAmount]);

  const [checked, setChecked] = useState(false);

  return (
    <>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={{ flexDirection: "row", marginTop: "10%" }}></View>
        <FlatList
          data={apiData}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.subHeaderContainer, { flex: 1 }]}>
                  <Text
                    style={[
                      styles.defaultText,
                      { fontWeight: "bold", fontSize: 16 },
                    ]}
                  >
                    {item.type}     Duration
                  </Text>
                  <Divider style={{ marginVertical: 5 }} />
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        styles.defaultText,
                        { fontWeight: "bold", flex: 2 },
                      ]}
                    >
                      Total Payable Amount:
                    </Text>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        editable={false}
                        value={billPaymentAmount[item.ID]}
                        keyboardType={"numeric"}
                        mode={"outlined"}
                        label={"ZMW"}
                        dense={true}
                        render={(props) => (
                          <TextInputMask {...props} mask="[99990].[99]" />
                        )}
                      />
                    </View>
                  </View>
                </View>
                <BouncyCheckbox
                  isChecked={checked}
                  fillColor={"green"}
                  unfillColor={"#FFFFFF"}
                  onPress={() => {
                    if (selectedBill.includes(item.ID)) {
                      setSelectedBill(
                        selectedBill.filter((value) => value !== item.ID)
                      );
                    } else {
                      setSelectedBill([...selectedBill, item.ID]);
                    }
                  }}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.ID}
          removeClippedSubviews={false}
        />

        {
          <>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                backgroundColor: "#00ff21",
              }}
            >
              <Text
                style={{
                  color: "white",
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Total Payout Amount:{" "}
              </Text>
              <View>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 24 }}
                >
                  K {totalPaymentAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </>
        }
      </ImageBackground>
    </>
  );
}
class Calculate extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {};
  }

  render() {
    return <>{<Calculator {...this.props} {...this.navigation} />}</>;
  }
}

export default Calculate;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerTitle: {
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subHeaderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  subHeaderTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#2c1855",
    padding: 10,
    borderRadius: 10,
  },
  defaultText: {
    color: "black",
  },
});
