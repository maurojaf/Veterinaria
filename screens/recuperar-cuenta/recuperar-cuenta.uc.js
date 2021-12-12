import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  StyledTextInput,
  PageLogo,
  LeftIconInput,
  LeftIcon,
  PageTitle,
  SubTitle,
  StyledFormArea,
  RightIconWelcome,
  StyledButton,
  ButtonText,
  StyledInputLabel,
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
import Recaptcha from "react-native-recaptcha-that-works";

//Colors
const { brand, darklight, primary } = Colors;

const RecuperarCuenta = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mail, setMail] = useState("");
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const clearLogin = () => {
    AsyncStorage.removeItem("token")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };
  const VolverLogin = () => {
    navigation.navigate("Login");
  };

  const EnvarCorreoParaRecuperarCuenta = async () => {
    setLoading(true);
    const url = "" + "api/v1/LoginClient/LoginValidate";
    let configAxios = {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    let dataEnviada = {
      Email: mail,
    };
    if (mail === "") {
      setMensaje("Ingresa un correo!");
      setLoading(false);
    } else {
      axios
        .post(url, dataEnviada, configAxios)
        .then((response) => {
          if (response.status !== 200) {
            setLoading(false);
            setMensaje("Correo no válido");
          } else {
            // navigation.navigate("Bienvenido");
            setMensaje("Se ha enviado un correo con tus datos");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setMensaje("Error al conectar con la Base de Datos");
          setLoading(false);
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Recuperar Cuenta </SubTitle>
          <RightIconLabel>
            <Ionicons name={"key"} size={30} color={darklight} />
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
                <MsgBox>Ingresa tu correo </MsgBox>
                <View>
                  <StyledTextInput
                    value={mail}
                    onChangeText={(itemValue) => setMail(String(itemValue))}
                  />
                  <LeftIconInput>
                    <Ionicons name={"mail"} size={30} color={darklight} />
                  </LeftIconInput>
                </View>
                <SubTitle>{mensaje}</SubTitle>
                {loading ? (
                  <>
                    <StyledButton
                      google
                      onPress={EnvarCorreoParaRecuperarCuenta}
                    >
                      <ActivityIndicator size="large" color={primary} />
                    </StyledButton>
                  </>
                ) : (
                  <>
                    <StyledButton
                      google
                      onPress={EnvarCorreoParaRecuperarCuenta}
                    >
                      <ButtonText>Solicitar</ButtonText>
                      <RightIconWelcome>
                        <Ionicons
                          name={"help-buoy"}
                          size={25}
                          color={primary}
                        />
                      </RightIconWelcome>
                    </StyledButton>
                  </>
                )}

                <StyledButton usuario onPress={VolverLogin}>
                  <ButtonText>Cancelar</ButtonText>
                  <RightIconWelcome>
                    <Ionicons name={"home"} size={25} color={primary} />
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

export default RecuperarCuenta;
