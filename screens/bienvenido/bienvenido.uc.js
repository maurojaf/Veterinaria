import React, { useEffect, useState, useContext } from "react";
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
  RightIconWelcome,
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
import { View, Picker, ActivityIndicator } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Colors
const { brand, darklight, primary } = Colors;

const Bienvenido = ({ navigation }) => {
  const [urlGlobal, setUrlGlobal] = useState("");
  const [token, setToken] = useState("");
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const clearLogin = () => {
    AsyncStorage.removeItem("token")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };
  const GetUrlGlobal = async () => {
    const url = await AsyncStorage.getItem("urlGlobal");
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    setUrlGlobal(url);
    setToken(token);
  };
  const IrUsuario = () => {
    navigation.navigate("Usuario");
  };
  const IrMascotas = () => {
    navigation.navigate("Mascotas");
  };

  useEffect(() => {
    GetUrlGlobal();
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Bienvenido Usuario </SubTitle>
          <Formik initialValues={{ mascota: "" }} onSubmit={(values) => {}}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              values,
            }) => (
              <StyledFormArea>
                <MsgBox>Selecciona una Opción </MsgBox>
                <Line />
                <StyledButton usuario onPress={IrUsuario}>
                  <ButtonText>Información de Usuario</ButtonText>
                  <RightIconWelcome>
                    <Octicons name={"person"} size={25} color={primary} />
                  </RightIconWelcome>
                </StyledButton>
                <StyledButton google onPress={IrMascotas}>
                  <ButtonText>Información de Mascotas</ButtonText>
                  <RightIconWelcome>
                    <Octicons name={"octoface"} size={25} color={primary} />
                  </RightIconWelcome>
                </StyledButton>
                <StyledButton onPress={clearLogin}>
                  <ButtonText>Cerrar Sesión</ButtonText>
                  <RightIconWelcome>
                    <Octicons name={"sign-out"} size={25} color={primary} />
                  </RightIconWelcome>
                </StyledButton>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default Bienvenido;
