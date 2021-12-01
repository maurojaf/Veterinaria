import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  RightIconWelcome,
  StyledButton,
  ButtonText,
  RightIconLabel,
  MsgBox,
  Line,
  Colors,
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
  const [nombreUsuario, setNombreUsuario] = useState("");
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
    ObtenerNombreusuario(url, token);
  };
  const IrUsuario = () => {
    navigation.navigate("Usuario");
  };
  const IrMascotas = () => {
    navigation.navigate("Mascotas");
  };
  const ObtenerNombreusuario = async (urlObtenida, tokenObtenido) => {
    const url = urlObtenida + "api/v1/Client/get";
    let configAxios = {
      headers: {
        Authorization: `Bearer ${tokenObtenido}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    axios
      .get(url, configAxios)
      .then((response) => {
        if (response.status !== 200) {
          console.log("error al obtener información");
        } else {
          setNombreUsuario(response.data.Result.Value.Name);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          clearLogin();
        } else {
          console.log(error);
        }
      });
  };

  useEffect(() => {
    GetUrlGlobal();
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Bienvenido {nombreUsuario} </SubTitle>
          <RightIconLabel>
            <Ionicons name={"person-circle"} size={30} color={darklight} />
          </RightIconLabel>
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

                <StyledButton google onPress={IrMascotas}>
                  <ButtonText>Información de Mascotas</ButtonText>
                  <RightIconWelcome>
                    <Octicons name={"octoface"} size={25} color={primary} />
                  </RightIconWelcome>
                </StyledButton>
                <StyledButton usuario onPress={IrUsuario}>
                  <ButtonText>Información de Usuario</ButtonText>
                  <RightIconWelcome>
                    <Octicons name={"person"} size={25} color={primary} />
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
