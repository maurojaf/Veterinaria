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
import axios from "axios";

//Colors
const { brand, darklight, primary } = Colors;

const Mascotas = ({ navigation }) => {
  const [mascotas, setMascotas] = useState("");
  const [urlGlobal, setUrlGlobal] = useState("");
  const [mascotasSelect, setMascotasSelect] = useState([]);
  const [token, setToken] = useState("");
  const [pesoMascota, setPesoMascota] = useState(0);
  // const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [edad, setEdad] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
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
    getSelectMascotas(url, token);
  };
  const getSelectMascotas = async (urlObtenida, tokenObtenido) => {
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
        // console.log(response);
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
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error + " entro en error");
      });
  };

  const handleSelectMascota = async (value) => {
    setMascotas(value);
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
              setPesoMascota(row.Weight);
              // setFechaNacimiento(row.DateOfBirth);
              setEdad(row.Age);
              setEspecie(row.Specie);
              setRaza(row.Clasification);
              return "ok";
            }
            // else {
            //   setPesoMascota(null);
            //   setFechaNacimiento("");
            //   setEdad("");
            //   setEspecie("");
            //   setRaza("");
            // }
          });
        }
      })
      .catch((error) => {
        console.log(error + " entro en error");
      });
  };

  useEffect(() => {
    GetUrlGlobal();
    // getSelectMascotas();
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
                <SubTitle>Especie : {especie}</SubTitle>
                <SubTitle>Raza : {raza}</SubTitle>
                <SubTitle>Edad : {edad}</SubTitle>
                <SubTitle>Peso : {pesoMascota}</SubTitle>
                {/* <SubTitle>Fecha Nacimiento : {fechaNacimiento}</SubTitle> */}
                <SubTitle>URL Seteada : {urlGlobal}</SubTitle>
                {/* <SubTitle>Token : {token}</SubTitle> */}
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
