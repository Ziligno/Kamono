import React, { useState, useEffect } from "react";
import { View, Image, ToastAndroid, StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import Header from "../components/Header";
import Logo from "../components/Logo";
import { NavigationContainer } from "@react-navigation/native";

export default function UploadImageScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [uidValue, setUidValue] = useState("");
  const [nrcfront, setnrcfront] = useState(null);
  const [nrcback, setnrcback] = useState(null);
  const [selfie, setselfie] = useState(null);

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
  useEffect(() => {
    getData();
  }, []);

  const handleFrontNRC = () => {
    let imageValue;
    launchImageLibrary({ noData: true }, (response) => {
      response?.assets.map(({ uri }) => {
        imageValue = uri;
        console.log("----", uri);
      });
      if (response) {
        setPhoto(imageValue);
        setnrcfront("NotNull");
      }
    });
  };

  const handleBackNRC = () => {
    let imageValue;
    launchImageLibrary({ noData: true }, (response) => {
      response?.assets.map(({ uri }) => {
        imageValue = uri;
        console.log("----", uri);
      });
      if (response) {
        setPhoto(imageValue);
        setnrcback("NotNull");
      }
    });
  };
  const handleSelfie = async () => {
    let imageValue;
    launchImageLibrary({ noData: true }, (response) => {
      response?.assets.map(({ uri }) => {
        imageValue = uri;
        console.log("----", uri);
      });
      if (response) {
        setPhoto(imageValue);
        setselfie("NotNull");
      }
    });
  };

  const handleUploadPhoto = async (path) => {
    let filename = photo.substring(photo.lastIndexOf("/") + 1);
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");

    filename = name + Date.now() + "." + extension;

    const storageRef = storage().ref(`${path}/${filename}`);
    const task = storageRef.putFile(photo);

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      console.log("stored at ", url, "doc id", uidValue);

      if (path == "NRC_FRONT") {
        firestore().collection("Users").doc(uidValue).update({
          NRC_FRONT: url,
        });
        setPhoto(null);
        setnrcfront("");
      } else if (path == "NRC_BACK") {
        firestore().collection("Users").doc(uidValue).update({
          NRC_BACK: url,
        });
        setPhoto(null);
        setnrcback("");
      } else if (path == "SELFIE") {
        firestore().collection("Users").doc(uidValue).update({
          SELFIE: url,
        });
        setPhoto(null);
        setselfie("");
      }
      ToastAndroid.show("Uploaded Succesfully", ToastAndroid.LONG);
    } catch (e) {
      console.log("errror at ", e);
    }
  };

  return (
    <View
      style={{
        flex: 3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Logo />
      {selfie == null || nrcfront == null || nrcback == null ? (
        <Header>One more Step !</Header>
      ) : (
        <Header>All Done !</Header>
      )}

      {photo && (
        <>
          <Image source={{ uri: photo }} style={{ width: 300, height: 300 }} />
          {nrcfront == "NotNull" && nrcfront != "" ? (
            <Button
              mode="contained"
              onPress={() => handleUploadPhoto("NRC_FRONT")}
              style={{
                marginTop: 24,
                borderRadius: 20,
                width: "60%",
                alignSelf: "center",
              }}
            >
              Upload Front
            </Button>
          ) : null}
          {nrcback == "NotNull" && nrcback != "" ? (
            <Button
              mode="contained"
              onPress={() => handleUploadPhoto("NRC_BACK")}
              style={{
                marginTop: 24,
                borderRadius: 20,
                width: "60%",
                alignSelf: "center",
              }}
            >
              Upload Back
            </Button>
          ) : null}
          {selfie == "NotNull" && selfie != "" ? (
            <Button
              mode="contained"
              onPress={() => handleUploadPhoto("SELFIE")}
              style={{
                marginTop: 24,
                borderRadius: 20,
                width: "60%",
                alignSelf: "center",
              }}
            >
              Upload Selfie
            </Button>
          ) : null}
        </>
      )}

      {nrcfront == null ? (
        <Button
          mode="contained"
          onPress={handleFrontNRC}
          style={{
            marginTop: 24,
            borderRadius: 20,
            width: "60%",
            alignSelf: "center",
          }}
        >
          {nrcfront == null ? "Front NRC" : "✔"}
        </Button>
      ) : null}
      {nrcback == null ? (
        <Button
          mode="contained"
          onPress={handleBackNRC}
          style={{
            marginTop: 24,
            borderRadius: 20,
            width: "60%",
            alignSelf: "center",
          }}
        >
          {nrcback == null ? "BACK NRC" : "✔"}
        </Button>
      ) : null}
      {selfie == null ? (
        <Button
          mode="contained"
          onPress={handleSelfie}
          style={{
            marginTop: 24,
            borderRadius: 20,
            width: "60%",
            alignSelf: "center",
          }}
        >
          {selfie == null ? "Selfie" : "✔"}
        </Button>
      ) : null}

      {selfie != null && nrcfront != null && nrcback != null ? (
        <Button
          mode="contained"
          onPress={() => navigation.replace("Dashboard")}
          style={{
            marginTop: 24,
            borderRadius: 20,
            width: "60%",
            alignSelf: "center",
          }}
        >
          Proceed
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {},
});
