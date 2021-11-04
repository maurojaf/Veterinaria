import React, { useEffect, useState } from "react";
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

//Colors
const { brand, darklight, primary } = Colors;

const FichaClinica = ({ navigation }) => {
  const [mascotas, setMascotas] = useState("Jacko");
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Ficha Clinica de Pepito</SubTitle>
          <Formik
            initialValues={{ mascota: "" }}
            onSubmit={(values) => {
              console.log(values);
              navigation.navigate("Login");
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <MsgBox>Información sobre Atenciones Veterinarias </MsgBox>
                {/* <StyledPicker
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
                </StyledPicker> */}
                {/* <StyledButton onPress={handleSubmit}>
                  <ButtonText>Seleccionar Mascota </ButtonText>
                </StyledButton> */}
                <Line />
                <MsgBox>Fecha 20/05/2021</MsgBox>
                <Line />
                <SubTitle>Nombre : {mascotas}</SubTitle>
                <SubTitle>Diagnóstico : 6 meses, Vacuna antirrábica </SubTitle>
                <SubTitle>Medicamentos : Vacuna antirrábica</SubTitle>
                <SubTitle>Veterinario : Bernardo Quinteros</SubTitle>
                <Line />
                <StyledButton google onPress={handleSubmit}>
                  <ButtonText>Descargar PDF de Atención Médica </ButtonText>
                </StyledButton>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default FichaClinica;
