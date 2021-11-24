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
import { View, Picker, ActivityIndicator } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Colors
const { brand, darklight, primary } = Colors;

const Mascotas = ({ navigation }) => {
  const [mascotas, setMascotas] = useState("");
  const [urlGlobal, setUrlGlobal] = useState("");
  const [token, setToken] = useState("");
  const [mascotasSelect, setMascotasSelect] = useState([]);
  const [pesoMascota, setPesoMascota] = useState(null);
  const [idMascota, setIdMascota] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [edad, setEdad] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [idMascotaStorage, setIdMascotaStorage] = useState("");
  const [disabledDetalleAtención, setDisabledDetalleAtención] = useState(true);
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  let idStorage = "";

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
    getSelectMascotas(url, token);
  };
  const getSelectMascotas = async (urlObtenida, tokenObtenido) => {
    setLoading(true);
    const url = urlObtenida + "api/v1/Client/pets";
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
          const data = [];
          response.data.Result.Value.map((row, i) => {
            let ds_json = {
              mascota: "",
            };
            ds_json.mascota = row.Name;
            data.push(ds_json);
          });
          setMascotasSelect(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          clearLogin();
        }
      });
  };
  const handleSelectMascota = async (value) => {
    setMascotas(value);
    setDisabledDetalleAtención(true);
    setPesoMascota(null);
    // setFechaNacimiento(row.DateOfBirth);
    setEdad(null);
    setEspecie("");
    setRaza("");
    setIdMascota(null);
    setLoading(true);
    const url = urlGlobal + "api/v1/Client/pets";
    let configAxios = {
      headers: {
        Authorization: `Bearer ${token}`,
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
          response.data.Result.Value.map((row, i) => {
            if (row.Name === value) {
              AsyncStorage.setItem("idMascota", JSON.stringify(row.Id));

              setIdMascota(row.Id);
              setPesoMascota(row.Weight);
              // setFechaNacimiento(row.DateOfBirth);
              setEdad(row.Age);
              setEspecie(row.Specie);
              setRaza(row.Clasification);
              setDisabledDetalleAtención(false);
              return "ok";
            }
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setDisabledDetalleAtención(true);
        setLoading(false);
        if (error.response.status === 401) {
          setLoading(false);
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
          <SubTitle>Listado de Mascotas</SubTitle>
          <Formik
            initialValues={{ mascota: "" }}
            onSubmit={(values) => {
              // console.log(values);
              navigation.navigate("FichaClinica");
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              values,
            }) => (
              <StyledFormArea>
                <MsgBox>Selecciona una de tus mascotas </MsgBox>
                <StyledPicker
                  selectedValue={mascotas}
                  value={values.mascota}
                  onValueChange={(itemValue, itemIndex) =>
                    handleSelectMascota(itemValue)
                  }
                >
                  <StyledPicker.Item label="Seleccione Mascota" value="" />
                  {mascotasSelect.map((row, i) => (
                    <StyledPicker.Item
                      label={row.mascota}
                      value={row.mascota}
                      key={i}
                    />
                  ))}
                </StyledPicker>
                {/* <StyledButton onPress={handleSeleccionarMascota}>
                  <ButtonText>Seleccionar Mascota </ButtonText>
                </StyledButton> */}
                <Line />
                <SubTitle>Nombre : {mascotas}</SubTitle>
                <SubTitle>Id Mascota : {idMascota}</SubTitle>
                <SubTitle>Especie : {especie}</SubTitle>
                <SubTitle>Raza : {raza}</SubTitle>
                <SubTitle>Edad : {edad}</SubTitle>
                <SubTitle>Peso : {pesoMascota} KG</SubTitle>
                <Line />
                <StyledButton
                  disabled={disabledDetalleAtención}
                  google
                  onPress={handleSubmit}
                >
                  <ButtonText>
                    {!disabledDetalleAtención ? (
                      "Obtener Detalles de Atención Médica de " + mascotas
                    ) : loading ? (
                      <ActivityIndicator size="large" color={primary} />
                    ) : (
                      "Selecciona una mascota antes de continuar "
                    )}
                  </ButtonText>
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
