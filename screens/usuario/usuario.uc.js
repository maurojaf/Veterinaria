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

const Usuario = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [user, setUser] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [urlGlobal, setUrlGlobal] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
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
    ObtenerUsuario(url, token);
  };

  const ObtenerUsuario = async (urlObtenida, tokenObtenido) => {
    const url = urlObtenida + "api/v1/Client/myprofile";
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
          setNombre(response.data.Result.Value.Client.Name);
          setMail(response.data.Result.Value.Client.Email);
          setTelefono(response.data.Result.Value.Client.Telephone);
          setUser(response.data.Result.Value.LoginUser);
          setObservaciones(response.data.Result.Value.Client.Observation);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          clearLogin();
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
          <SubTitle>Información de Usuario </SubTitle>
          <Formik initialValues={{ mascota: "" }} onSubmit={(values) => {}}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              values,
            }) => (
              <StyledFormArea>
                <MsgBox>Revisa / Edita tu Información </MsgBox>
                <Line />
                <StyledInputLabel>Nombre Completo</StyledInputLabel>
                <StyledTextInput
                  value={nombre}
                  onChangeText={(itemValue) => setNombre(String(itemValue))}
                />
                <StyledInputLabel>Correo</StyledInputLabel>
                <StyledTextInput
                  value={mail}
                  onChangeText={(itemValue) => setMail(String(itemValue))}
                />
                <StyledInputLabel>Telefono</StyledInputLabel>
                <StyledTextInput
                  value={telefono}
                  onChangeText={(itemValue) => setTelefono(String(itemValue))}
                />
                <StyledInputLabel>Usuario Aplicación</StyledInputLabel>
                <StyledTextInput
                  value={user}
                  onChangeText={(itemValue) => setUser(String(itemValue))}
                />
                <StyledInputLabel>Observaciones</StyledInputLabel>
                <StyledTextInput
                  value={observaciones}
                  onChangeText={(itemValue) =>
                    setObservaciones(String(itemValue))
                  }
                />
                <Line />
                <StyledButton google onPress={clearLogin}>
                  <ButtonText>Guardar Datos Editados</ButtonText>
                  <RightIconWelcome>
                    <Octicons name={"checklist"} size={25} color={primary} />
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

export default Usuario;
