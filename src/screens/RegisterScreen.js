import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import {
  detailsValidator,
  passwordValidator,
  phoneNumberValidator,
} from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

export default function RegisterScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [Nrc, setNrc] = useState({ value: "", error: "" });
  const [dateOfBirth, setDateOfBirth] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [residentialAddress, setResidentialAddress] = useState({
    value: "",
    error: "",
  });
  const [province, setProvince] = useState({ value: "", error: "" });
  const [district, setDistrict] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const usersCollection = firestore().collection("Users");

  const storeUid = async (value) => {
    try {
      await AsyncStorage.setItem("Uid", value);
    } catch (error) {
      console.log(error);
    }
  };

  const onSignUpPressed = () => {
    setIsLoading(true);
    const nameError = nameValidator(name.value);
    const lastNameError = nameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const dateOfBirthError = detailsValidator(dateOfBirth.value);
    const phoneNumberError = phoneNumberValidator(phoneNumber.value);
    const residentialAddressError = detailsValidator(residentialAddress.value);
    const provinceError = detailsValidator(province.value);
    const districtError = detailsValidator(district.value);
    const nrcError = detailsValidator(Nrc.value);

    if (
      emailError ||
      passwordError ||
      nameError ||
      lastNameError ||
      dateOfBirthError ||
      phoneNumberError ||
      residentialAddressError ||
      provinceError ||
      districtError ||
      nrcError
    ) {
      setName({ ...name, error: nameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setDateOfBirth({ ...dateOfBirth, error: dateOfBirthError });
      setPhoneNumber({ ...phoneNumber, error: phoneNumberError });
      setResidentialAddress({
        ...residentialAddress,
        error: residentialAddressError,
      });
      setProvince({ ...province, error: provinceError });
      setDistrict({ ...district, error: districtError });
      setNrc({ ...Nrc, error: nrcError });
      setIsLoading(false);
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((response) => {
        console.log("user account created and signed in", response.user.uid);
        storeUid(response.user.uid);
        usersCollection
          .doc(response.user.uid)
          .set({
            userID: response.user.uid,
            firstName: name.value,
            lastName: lastName.value,
            email: email.value,
            DOB: dateOfBirth.value,
            PhoneNumber: phoneNumber.value,
            Address: residentialAddress.value,
            Province: province.value,
            District: district.value,
            NRC: Nrc.value,
          })
          .then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "UploadImageScreen" }],
            });
            setIsLoading(true);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <ImageBackground
      source={require("../assets/background_dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <BackButton goBack={navigation.goBack} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", alignContent: "center" }}
        >
          <Logo />
          <Header>Create Account</Header>
          <TextInput
            label="First Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
          />
          <TextInput
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({ value: text, error: "" })}
            error={!!lastName.error}
            errorText={lastName.error}
          />
          <TextInput
            label="Nrc Number"
            returnKeyType="next"
            value={Nrc.value}
            onChangeText={(text) => setNrc({ value: text, error: "" })}
            error={!!Nrc.error}
            errorText={Nrc.error}
          />
          <TextInput
            label="Date Of Birth"
            returnKeyType="next"
            value={dateOfBirth.value}
            onChangeText={(text) => setDateOfBirth({ value: text, error: "" })}
            error={!!dateOfBirth.error}
            errorText={dateOfBirth.error}
          />
          <TextInput
            label="Phone Number"
            returnKeyType="next"
            value={phoneNumber.value}
            onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
            error={!!phoneNumber.error}
            errorText={phoneNumber.error}
          />
          <TextInput
            label="Residential Address"
            returnKeyType="next"
            value={residentialAddress.value}
            onChangeText={(text) =>
              setResidentialAddress({ value: text, error: "" })
            }
            error={!!residentialAddress.error}
            errorText={residentialAddress.error}
          />
          <TextInput
            label="Province"
            returnKeyType="next"
            value={province.value}
            onChangeText={(text) => setProvince({ value: text, error: "" })}
            error={!!province.error}
            errorText={province.error}
          />

          <TextInput
            label="District"
            returnKeyType="next"
            value={district.value}
            onChangeText={(text) => setDistrict({ value: text, error: "" })}
            error={!!district.error}
            errorText={district.error}
          />
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          {isLoading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <Button
              mode="contained"
              onPress={onSignUpPressed}
              style={{ marginTop: 24 }}
            >
              Sign Up
            </Button>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: "95%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: "5%",
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
