import React, { useState, useContext, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Colors
const { brand, darklight, primary } = Colors;

const Login = ({ navigation }) => {
  const [veterinaria, setVeterinaria] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(0);
  const [selectVeterinaria, setSelectVeterinaria] = useState([]);
  const [urlLoginConcatenado, setUrlLoginConcatenado] = useState("");
  const [loading, setLoading] = useState(false);
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const PersistLogin = (Token, Status) => {
    AsyncStorage.setItem("token", Token)
      .then(() => {
        HandleMessage("Iniciando Sesión Automaticamente", Status);
        console.log(Token);
        setStoredCredentials(Token);
      })
      .catch((error) => {
        console.log(error);
        AsyncStorage.removeItem("token");
        HandleMessage(
          "Error al Recuperar su sesión, Reintente iniciando sesión",
          Status
        );
      });
  };
  const HandleLogin = (credentials, setSubmitting) => {
    setLoading(true);
    HandleMessage(null);
    if (urlLoginConcatenado === "") {
      HandleMessage("Seleccione una Veterinaria");
      setSubmitting(false);
      setLoading(false);
    } else {
      const url = urlLoginConcatenado + "api/v1/LoginClient/LoginValidate";
      axios
        .post(url, credentials)
        .then((response) => {
          if (response.status !== 200) {
            HandleMessage("Error en usuario y/o contraseña");
            setLoading(false);
          } else {
            navigation.navigate("Bienvenido");
            PersistLogin(response.data.Result.Value.Token, response.status);
          }
          setSubmitting(false);
          setLoading(false);
        })
        .catch((error) => {
          error.response.status === 422
            ? HandleMessage("Error de usuario/contraseña")
            : HandleMessage("Error de conexión");
          setSubmitting(false);
          setLoading(false);
        });
    }
  };
  const HandleLoginGoogle = (values) => {
    console.log(values);
    setLoading(true);
    HandleMessage(null);
    if (urlLoginConcatenado === "") {
      HandleMessage("Seleccione una Veterinaria");

      setLoading(false);
    } else {
      const url = urlLoginConcatenado + "api/v1/LoginClient/LoginValidate";
      axios
        .post(url, values)
        .then((response) => {
          if (response.status !== 200) {
            HandleMessage("Error en usuario y/o contraseña");
            setLoading(false);
          } else {
            navigation.navigate("Bienvenido");
            PersistLogin(response.data.Result.Value.Token, response.status);
          }
          setLoading(false);
        })
        .catch((error) => {
          error.response.status === 422
            ? HandleMessage("Error de usuario/contraseña")
            : HandleMessage("Error de conexión");
          setLoading(false);
        });
    }
  };
  const HandleMessage = (message, type) => {
    setMessage(message);
    setMessageType(type);
  };
  const HandleSelect = () => {
    setLoading(true);
    HandleMessage(null);
    const url =
      "https://appserv-contract.azurewebsites.net/api/v1/LoginEmployee";
    axios
      .get(url)
      .then((response) => {
        // console.log(response.data.Result.Value.Token);
        if (response.status !== 200) {
          HandleMessage("Error al Obtener Información Sesión", response.status);
          setLoading(false);
        } else {
          const data = [];
          response.data.Result.Value.map((row, i) => {
            let ds_json = {
              veterinaria: "",
            };
            ds_json.veterinaria = row.FantasyName;
            data.push(ds_json);
          });
          setSelectVeterinaria(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        HandleMessage("Error de conexión");
      });
  };
  const handleChangeVeterinaria = async (value) => {
    setLoading(true);
    setVeterinaria(value);
    const url =
      "https://appserv-contract.azurewebsites.net/api/v1/LoginEmployee";
    axios
      .get(url)
      .then((response) => {
        if (response.status !== 200) {
          setLoading(false);
          HandleMessage(
            "Error al Obtener Información de la Veterinaria",
            response.status
          );
        } else {
          response.data.Result.Value.map((row, i) => {
            if (row.FantasyName === value) {
              row.Urls.map((row2, i) => {
                row2.UrlName === "Api Login"
                  ? setUrlLoginConcatenado(row2.Url)
                  : AsyncStorage.setItem("urlGlobal", row2.Url);
              });
            }
            setLoading(false);
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        HandleMessage("Error de conexión");
      });
  };
  const RecuperarCuenta = () => {
    navigation.navigate("Recuperar");
  };

  useEffect(() => {
    HandleSelect();
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo
            resizeMode="cover"
            source={require("../../assets/img/login.png")}
          />
          <PageTitle>Bienvenido/a</PageTitle>
          <SubTitle>Selecciona La Veterinaria</SubTitle>
          <Formik
            initialValues={{ LoginUser: "", Password: "" }}
            onSubmit={(values, { setSubmitting }) => {
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
                  onValueChange={(itemValue) =>
                    handleChangeVeterinaria(itemValue)
                  }
                >
                  <StyledPicker.Item label="Seleccione Veterinaria" value="" />
                  {selectVeterinaria.map((data, i) => (
                    <StyledPicker.Item
                      label={data.veterinaria}
                      value={data.veterinaria}
                      key={i}
                    />
                  ))}
                </StyledPicker>
                <MyTextInput
                  label="Usuario"
                  icon="person"
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
                {/* {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Iniciar Sesión </ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton onPress={handleSubmit} disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )} */}
                {loading ? (
                  <StyledButton onPress={handleSubmit} disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                ) : (
                  <StyledButton onPress={handleSubmit}>
                    <Fontisto name="key" color={primary} size={25} />
                    <ButtonText google>Iniciar Sesión </ButtonText>
                  </StyledButton>
                )}

                <Line />
                <StyledButton
                  google={true}
                  onPress={() => {
                    HandleLoginGoogle(values);
                  }}
                >
                  <Fontisto name="google" color={primary} size={25} />
                  <ButtonText google> Iniciar sesión con Google </ButtonText>
                </StyledButton>
                <ExtraView>
                  {/* <ExtraText>Olvidaste tus datos? </ExtraText> */}
                  <TextLink onPress={RecuperarCuenta}>
                    <TextLinkContent>
                      Clic aquí para recuperar cuenta
                    </TextLinkContent>
                  </TextLink>
                </ExtraView>
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
