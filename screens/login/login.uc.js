import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  Colors,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  StyledPicker,
} from "../../components/styles";
import { Formik } from "formik";
import { View, ActivityIndicator } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Colors
const { brand, darklight, primary } = Colors;

const Login = ({ navigation }) => {
  const [veterinaria, setVeterinaria] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(0);
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  // const PersistLogin = (credentials, message, status) => {
  const PersistLogin = () => {
    AsyncStorage.setItem("token", "sdadsadasd");
    // AsyncStorage.setItem("token", JSON.stringify(credentials))
    //   .then(() => {
    //     setStoredCredentials(credentials);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const HandleLogin = (credentials, setSubmitting) => {
    HandleMessage(null);
    const url =
      "http://appserv-loginclient.azurewebsites.net/api/v1/LoginClient/LoginValidate";
    axios
      .post(url, credentials)
      .then((response) => {
        // console.log(response.data.Result.Value.Token);
        if (response.status !== 200) {
          HandleMessage("Error al Iniciar Sesión", response.status);
        } else {
          navigation.navigate("Mascotas", { ...response.data });
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
        HandleMessage("Error de conexión");
      });
  };

  const HandleMessage = (message, type) => {
    setMessage(message);
    setMessageType(type);
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo
            resizeMode="cover"
            source={require("../../assets/img/login.png")}
          />
          <PageTitle>Veterinaria Bienvenido</PageTitle>
          <SubTitle>Selecciona La Veterinaria que visitaste</SubTitle>
          <Formik
            initialValues={{ LoginUser: "", Password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              // console.log(values);
              // navigation.navigate("Mascotas");
              if (values.LoginUser == "" || values.Password == "") {
                HandleMessage("Ingresa los campos de Correo y/o Contraseña");
                setSubmitting(false);
              } else {
                HandleLogin(values, setSubmitting);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <StyledFormArea>
                <StyledPicker
                  selectedValue={veterinaria}
                  value={values.veterinaria}
                  onValueChange={(itemValue, itemIndex) =>
                    setVeterinaria(itemValue)
                  }
                >
                  <StyledPicker.Item
                    label="Veterinaria San Nicolas"
                    value="VetBilbao"
                  />
                  <StyledPicker.Item
                    label="Puppies and Kittens"
                    value="PandK"
                  />
                  <StyledPicker.Item label="Llanquihue" value="Llanquihue" />
                </StyledPicker>
                <MyTextInput
                  label="Correo Registrado"
                  icon="mail"
                  placeholder="ingresa tu cuenta"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange("LoginUser")}
                  onBlur={handleBlur("LoginUser")}
                  value={values.LoginUser}
                  keyboardType="email-address"
                />
                <MyTextInput
                  label="Contraseña"
                  icon="lock"
                  placeholder="*  *  *  *  *  *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange("Password")}
                  onBlur={handleBlur("Password")}
                  value={values.Password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Iniciar Sesión </ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton onPress={handleSubmit} disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

                <Line />
                {/* <StyledButton google={true} onPress={handleSubmit}>
                <Fontisto name="google" color={primary} size={25} />
                <ButtonText google> Iniciar sesión con Google </ButtonText>
              </StyledButton> */}
                {/* <ExtraView>
                  <ExtraText>No tengo cuenta? </ExtraText>
                  <TextLink>
                    <TextLinkContent>Crear Cuenta</TextLinkContent>
                  </TextLink>
                </ExtraView> */}
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={darklight} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={darklight}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
