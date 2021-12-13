import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  StyledTextInput,
  StyledPicker,
  LeftIconInput,
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
  const [selectVeterinaria, setSelectVeterinaria] = useState([]);
  const [veterinaria, setVeterinaria] = useState("");
  const [urlLoginConcatenado, setUrlLoginConcatenado] = useState("");
  const [correoValidado, setCorreoValidado] = useState(false);
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
  const HandleSelect = () => {
    setLoading(true);
    const url =
      "https://appserv-contract.azurewebsites.net/api/v1/LoginEmployee";
    axios
      .get(url)
      .then((response) => {
        // console.log(response.data.Result.Value.Token);
        if (response.status !== 200) {
          setMensaje("Error al obtener información de las Veterinarias");
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
      });
  };
  const EnvarCorreoParaRecuperarCuenta = async () => {
    setLoading(true);
    const url = urlLoginConcatenado + "api/v1/LoginClient/RestoreUser";
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
    } else if (urlLoginConcatenado === "") {
      setMensaje("Seleccione la veterinaria donde registro sus datos");
      setLoading(false);
    } else {
      if (correoValidado) {
        setMensaje("Se esta validando su información, favor espere");
        axios
          .post(url, dataEnviada, configAxios)
          .then((response) => {
            if (response.status !== 200) {
              setLoading(false);
              setMensaje("Correo no existe");
            } else {
              // navigation.navigate("Bienvenido");
              console.log();
              setMensaje("Se ha enviado un correo con tus datos");
            }
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setMensaje("Error al conectar con la Base de Datos");
            setLoading(false);
          });
      } else {
        setMensaje("Ingrese un correo válido");
        setLoading(false);
      }
    }
  };
  const validateMail = (text) => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      // console.log("Email is Not Correct");
      setCorreoValidado(false);
      return false;
    } else {
      // console.log("Email is Correct");
      setCorreoValidado(true);
    }
  };
  const handleChangeMail = (e) => {
    validateMail(e);
    setMail(e);
  };

  useEffect(() => {
    HandleSelect();
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Recuperar Cuenta </SubTitle>
          <StyledFormArea>
            <StyledPicker
              selectedValue={veterinaria}
              value={veterinaria}
              onValueChange={(itemValue) => handleChangeVeterinaria(itemValue)}
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
          </StyledFormArea>
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
                    onChangeText={(itemValue) =>
                      handleChangeMail(String(itemValue))
                    }
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
