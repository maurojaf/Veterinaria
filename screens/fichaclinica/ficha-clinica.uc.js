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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Colors
const { brand, darklight, primary } = Colors;

const FichaClinica = ({ navigation }) => {
  const [mascotas, setMascotas] = useState("Jacko");
  const [idMascota, setIdMascota] = useState("");
  const [urlGlobal, setUrlGlobal] = useState("");
  const [tokenState, setTokenState] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");
  const [dataObtenida, setDataObtenida] = useState([]);

  const getIdFromMascotas = async () => {
    const url = await AsyncStorage.getItem("urlGlobal");
    const token = await AsyncStorage.getItem("token");
    const idString = await AsyncStorage.getItem("idMascota");
    setIdMascota(idString);
    setUrlGlobal(url);
    setTokenState(token);
    ObtenerConsultasMedicas(url, token, idString);
  };

  const ObtenerConsultasMedicas = async (
    urlObtenida,
    tokenObtenido,
    idMascota
  ) => {
    const url =
      urlObtenida +
      "api/v1/Client/pets/" +
      parseInt(idMascota) +
      "/medicalconsultation";
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
          if (
            response.data.Result.Value.Mensaje ===
            "Mascota sin historial de consultas."
          ) {
            setMensaje(response.data.Result.Value.Mensaje);
          } else {
            setNombreMascota(response.data.Result.Value.Pet.Name);
            response.data.Result.Value.LstMedicalConsultation.map((row, i) => {
              let ds_json = {
                Anamnesis: "",
                Date: "",
                Diagnosis: "",
                Treatment: "",
                Observation: "",
                Veterinarian: {
                  NameVeterinario: "",
                  IdentityCard: "",
                  Telephone: "",
                },
                LstProducts: [],
              };
              ds_json.Anamnesis = row.Anamnesis;
              ds_json.Date = row.Date;
              ds_json.Diagnosis = row.Diagnosis;
              ds_json.Treatment = row.Treatment;
              ds_json.Observation = row.Observation;
              ds_json.Veterinarian.NameVeterinario = row.Veterinarian.Name;
              ds_json.Veterinarian.IdentityCard = row.Veterinarian.IdentityCard;
              ds_json.Veterinarian.Telephone = row.Veterinarian.Telephone;
              row.LstProducts.map((row1, i) => {
                ds_json.LstProducts.push(row1);
              });
              data.push(ds_json);
            });
            // console.log(data);
            setDataObtenida(data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getIdFromMascotas();
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <SubTitle>Ficha Clinica de {nombreMascota}</SubTitle>
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
                <Line />
                {dataObtenida.map((row, i) => (
                  <>
                    <SubTitle>Fecha : {row.Date} </SubTitle>
                    <SubTitle>Anamnesis : {row.Anamnesis} </SubTitle>
                    <SubTitle>Observaciones : {row.Observation} </SubTitle>
                    <SubTitle>Diagnostico : {row.Diagnosis} </SubTitle>
                    <SubTitle>Tratamiento : {row.Treatment} </SubTitle>
                    <SubTitle>
                      Veterinarian : {row.Veterinarian.NameVeterinario}
                    </SubTitle>
                    <SubTitle>RUT : {row.Veterinarian.IdentityCard}</SubTitle>
                    <SubTitle>Teléfono : {row.Veterinarian.Telephone}</SubTitle>
                    <Line />
                    {row.LstProducts.map((row1, i) => (
                      <>
                        <SubTitle>Nombre Producto : {row1.Name}</SubTitle>
                        <SubTitle>Descripción : {row1.Description}</SubTitle>
                        <SubTitle>Precio :{row1.Price}</SubTitle>
                        <Line />
                      </>
                    ))}
                    <StyledButton
                      google
                      // onPress={handleSubmit}
                    >
                      <ButtonText>Descargar Ficha en PDF</ButtonText>
                    </StyledButton>
                    <Line />
                  </>
                ))}
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default FichaClinica;
