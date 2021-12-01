import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  UserImage,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledFormAreaImage,
  LeftIcon,
  LeftIconInput,
  StyledInputLabel,
  StyledInputLabelMensaje,
  RightIconLabel,
  StyledTextInput,
  RightIconTextBox,
  RightIconWelcome,
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
import { View, Picker, ActivityIndicator, Image, Platform } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Colors
const { brand, darklight, primary } = Colors;

const Usuario = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [idUsuario, setIdUsuario] = useState(0);
  const [mail, setMail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [user, setUser] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [password, setPassword] = useState("");
  const [imagen, setImagen] = useState("");
  const [urlGlobal, setUrlGlobal] = useState("");
  const [token, setToken] = useState("");
  const [mensaje, setMensaje] = useState("");
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
    setUrlGlobal(url);
    setToken(token);
    ObtenerUsuario(url, token);
  };
  const ObtenerUsuario = async (urlObtenida, tokenObtenido) => {
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
          setIdUsuario(response.data.Result.Value.Id);
          setNombre(response.data.Result.Value.Name);
          setMail(response.data.Result.Value.Email);
          setTelefono(response.data.Result.Value.Telephone);
          setUser(response.data.Result.Value.LoginUser);
          setObservaciones(response.data.Result.Value.Observation);
          setImagen(response.data.Result.Value.Image);
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
  const GuardarDatosModificadosUsuario = async (
    id,
    name,
    email,
    telephone,
    observation
  ) => {
    setLoading(true);
    setMensaje("");
    const urlObtenida = await AsyncStorage.getItem("urlGlobal");
    const tokenObtenido = await AsyncStorage.getItem("token");
    const url = urlObtenida + "api/v1/Client/put";
    let configAxios = {
      headers: {
        Authorization: `Bearer ${tokenObtenido}`,
        "Content-Type": "application/json",
      },
    };
    let dataEnviada = {
      Id: id,
      Name: name,
      Email: email,
      Telephone: telephone,
      Observation: observation,
    };
    if (name === "" || email === "" || telephone === "" || observation === "") {
      setMensaje("Existen campos vacios, llénalos");
      setLoading(false);
    } else {
      axios
        .put(url, dataEnviada, configAxios)
        .then((response) => {
          if (response.status !== 200) {
            setLoading(false);
            setMensaje("error al enviar información");
          } else {
            setLoading(false);
            setMensaje(response.data.Result.Value.Mensaje);
          }
        })
        .catch((error) => {
          setLoading(false);
          setMensaje("Error al modificar datos");
          if (error.response.status === 401) {
            clearLogin();
          } else {
            console.log(error.response);
          }
        });
    }
  };

  useEffect(() => {
    GetUrlGlobal();
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Información de Usuario</SubTitle>
          <RightIconLabel>
            <Ionicons
              name={Platform.OS === "ios" ? "logo-apple" : "logo-android"}
              size={30}
              color={darklight}
            />
          </RightIconLabel>

          <Formik initialValues={{ usuario: "" }} onSubmit={(values) => {}}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              values,
            }) => (
              <>
                <StyledFormAreaImage>
                  <UserImage resizeMode="cover" source={{ uri: imagen }} />
                </StyledFormAreaImage>
                <StyledFormArea>
                  <Line />
                  <MsgBox>Revisa / Edita tu Información </MsgBox>
                  <Line />
                  <StyledInputLabel>Nombre Completo</StyledInputLabel>
                  <View>
                    <StyledTextInput
                      value={nombre}
                      onChangeText={(itemValue) => setNombre(String(itemValue))}
                    />
                    <LeftIconInput>
                      <Ionicons
                        name={"person-circle"}
                        size={30}
                        color={darklight}
                      />
                    </LeftIconInput>
                  </View>
                  <View>
                    <StyledInputLabel>Correo</StyledInputLabel>
                    <StyledTextInput
                      value={mail}
                      onChangeText={(itemValue) => setMail(String(itemValue))}
                    />
                    <LeftIcon>
                      <Ionicons name={"mail"} size={30} color={darklight} />
                    </LeftIcon>
                  </View>
                  <View>
                    <StyledInputLabel>Teléfono</StyledInputLabel>
                    <StyledTextInput
                      value={telefono}
                      onChangeText={(itemValue) =>
                        setTelefono(String(itemValue))
                      }
                    />
                    <LeftIcon>
                      <Ionicons name={"call"} size={30} color={darklight} />
                    </LeftIcon>
                  </View>
                  <View>
                    <StyledInputLabel>Usuario Aplicación</StyledInputLabel>
                    <StyledTextInput
                      disable
                      value={user}
                      onChangeText={(itemValue) => setUser(String(itemValue))}
                    />
                    <LeftIcon>
                      <Ionicons name={"person"} size={30} color={darklight} />
                    </LeftIcon>
                  </View>
                  <View>
                    <StyledInputLabel>Observaciones</StyledInputLabel>
                    <StyledTextInput
                      value={observaciones}
                      onChangeText={(itemValue) =>
                        setObservaciones(String(itemValue))
                      }
                    />
                    <LeftIcon>
                      <Ionicons name={"reader"} size={30} color={darklight} />
                    </LeftIcon>
                  </View>

                  <Line />
                  <SubTitle>{mensaje}</SubTitle>
                  <StyledButton
                    usuario
                    onPress={() => {
                      GuardarDatosModificadosUsuario(
                        idUsuario,
                        nombre,
                        mail,
                        telefono,
                        observaciones
                      );
                    }}
                  >
                    {loading ? (
                      <ButtonText>Guardando Datos...</ButtonText>
                    ) : (
                      <>
                        <ButtonText>Guardar Datos Editados</ButtonText>
                        <RightIconWelcome>
                          <Octicons
                            name={"checklist"}
                            size={25}
                            color={primary}
                          />
                        </RightIconWelcome>
                      </>
                    )}
                  </StyledButton>
                  <StyledButton onPress={clearLogin}>
                    <ButtonText>Cerrar Sesión</ButtonText>
                    <RightIconWelcome>
                      <Octicons name={"sign-out"} size={25} color={primary} />
                    </RightIconWelcome>
                  </StyledButton>
                </StyledFormArea>
              </>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default Usuario;
