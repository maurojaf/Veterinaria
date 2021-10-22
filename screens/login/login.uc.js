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
} from "../../components/styles";
import { Formik } from "formik";
import { View } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

//Colors
const { brand, darklight, primary } = Colors;

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageLogo
          resizeMode="cover"
          source={require("../../assets/img/login.png")}
        />
        <PageTitle>Veterinaria -- Bienvenido</PageTitle>
        <SubTitle>Inicia Sesión con tu Cuenta</SubTitle>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <MyTextInput
                label="Cuenta de Usuario"
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
              <ExtraView>
                <ExtraText>No tengo cuenta? </ExtraText>
                <TextLink>
                  <TextLinkContent>Crear Cuenta</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
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
