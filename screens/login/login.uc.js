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
import { View } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Colors
const { brand, darklight, primary } = Colors;

const Login = ({ navigation }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [veterinaria, setVeterinaria] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
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
            initialValues={{ email: "", password: "", veterinaria: "" }}
            onSubmit={(values) => {
              console.log(values);
              navigation.navigate("Mascotas");
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <StyledPicker
                  selectedValue={veterinaria}
                  value={values.veterinaria}
                  onValueChange={(itemValue, itemIndex) =>
                    setVeterinaria(itemValue)
                  }
                >
                  <StyledPicker.Item
                    label="Veterinaria Bilbao"
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
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                <MyTextInput
                  label="Contraseña"
                  icon="lock"
                  placeholder="*  *  *  *  *  *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox>
                  Ingresa tus credenciales para iniciar sesión en la Aplicación
                </MsgBox>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Iniciar Sesión </ButtonText>
                </StyledButton>
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
