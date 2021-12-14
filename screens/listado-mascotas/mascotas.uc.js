import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  StyledFormAreaImage,
  SubTitle,
  StyledFormArea,
  PetImage,
  RightIconLabel,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  CircleName,
  Colors,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  StyledPicker,
} from "../../components/styles";
import { Formik } from "formik";
import { View, Picker, ActivityIndicator, Text } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import { CredentialsContext } from "../../components/credentials-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";

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
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [imagen, setImagen] = useState("");
  const [initial, setInitial] = useState("");
  const [imagenVacia, setImagenVacia] = useState(true);
  const [valueMascota, setValueMascota] = useState("");
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
              id: 0,
              mascota: "",
            };
            ds_json.id = row.Id;
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
    setValueMascota(value);
    setMascotas("");
    setDisabledDetalleAtención(true);
    setPesoMascota(null);
    setFechaNacimiento("");
    setEdad(null);
    setEspecie("");
    setRaza("");
    setImagen("");
    setInitial("");
    setIdMascota(null);
    setLoading(true);
    setImagenVacia(true);
    const url = urlGlobal + "api/v1/Client/pets/" + parseInt(value);
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
          let res = response.data.Result.Value;
          AsyncStorage.setItem("idMascota", JSON.stringify(value));
          AsyncStorage.setItem("nombreMascota", res.Name);
          setMascotas(res.Name);
          setIdMascota(value);
          setPesoMascota(res.Weight);
          setFechaNacimiento(moment(res.DateOfBirth).format("DD-MM-YYYY"));
          setEdad(res.Age);
          setEspecie(res.Specie);
          setRaza(res.Clasification);
          setDisabledDetalleAtención(false);
          setImagen(res.Image);
          if (typeof res.Image === "undefined" || res.Image === null) {
            setImagenVacia(true);
          } else {
            setImagenVacia(false);
            setImagen(res.Image);
          }
          setInitial(res.Name.charAt(0) + res.Name.charAt(1));
          return "ok";
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
          <RightIconLabel>
            <Ionicons name={"paw"} size={30} color={darklight} />
          </RightIconLabel>
          <Formik
            initialValues={{ mascota: "" }}
            onSubmit={(values) => {
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
                  selectedValue={valueMascota}
                  value={valueMascota}
                  onValueChange={(itemValue, itemIndex) =>
                    handleSelectMascota(itemValue)
                  }
                >
                  {/* <StyledPicker.Item label="Seleccione Mascota" value="" /> */}
                  {mascotasSelect.map((row, i) => (
                    <StyledPicker.Item
                      label={row.mascota}
                      value={row.id}
                      key={i}
                    />
                  ))}
                </StyledPicker>
                {/* <StyledButton onPress={handleSeleccionarMascota}>
                  <ButtonText>Seleccionar Mascota </ButtonText>
                </StyledButton> */}
                <StyledFormAreaImage>
                  {imagenVacia === true ? (
                    <>
                      <CircleName>{initial}</CircleName>
                    </>
                  ) : (
                    <PetImage resizeMode="cover" source={{ uri: imagen }} />
                  )}
                </StyledFormAreaImage>
                <SubTitle>Nombre : {mascotas}</SubTitle>
                <SubTitle>Id Mascota : {idMascota}</SubTitle>
                <SubTitle>Fecha Nacimiento : {fechaNacimiento}</SubTitle>
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
