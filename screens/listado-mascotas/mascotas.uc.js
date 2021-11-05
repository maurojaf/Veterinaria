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
import { View, Picker } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Colors
const { brand, darklight, primary } = Colors;

const Mascotas = ({ navigation }) => {
  const [mascotas, setMascotas] = useState("Jacko");
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const clearLogin = () => {
    AsyncStorage.removeItem("token")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Listado de Mascotas</SubTitle>
          <Formik
            initialValues={{ mascota: "" }}
            onSubmit={(values) => {
              console.log(values);
              navigation.navigate("FichaClinica");
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <MsgBox>Selecciona una de tus mascotas </MsgBox>
                <StyledPicker
                  selectedValue={mascotas}
                  // style={{ height: 150, width: 150 }}
                  value={values.mascota}
                  onValueChange={(itemValue, itemIndex) =>
                    setMascotas(itemValue)
                  }
                >
                  <StyledPicker.Item label="Copito" value="Copito" />
                  <StyledPicker.Item label="Jacko" value="Jacko" />
                  <StyledPicker.Item label="Pepito" value="Pepito" />
                </StyledPicker>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Seleccionar Mascota </ButtonText>
                </StyledButton>
                <Line />
                <SubTitle>
                  Mascota Seleccioanda -{">"} {mascotas}
                </SubTitle>
                <MsgBox>
                  Desliza hacia abajo para más información relacionada a la
                  mascota {mascotas}
                </MsgBox>
                <Line />
                <SubTitle>Nombre : {mascotas}</SubTitle>
                <SubTitle>Raza : Kilterry</SubTitle>
                <SubTitle>Edad : 5 años</SubTitle>
                <SubTitle>Sexo : Macho</SubTitle>
                <SubTitle>Peso : 23 KG</SubTitle>
                <SubTitle>Color : Café Oscuro</SubTitle>
                <Line />
                <StyledButton google onPress={handleSubmit}>
                  <ButtonText>Detalles de Atención Médica </ButtonText>
                </StyledButton>
                <StyledButton onPress={clearLogin}>
                  <ButtonText>Cerrar Sesión </ButtonText>
                </StyledButton>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default Mascotas;
