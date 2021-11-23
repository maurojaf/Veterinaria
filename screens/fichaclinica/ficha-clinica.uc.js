import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  SubTitle,
  StyledFormAreaCard,
  StyledButton,
  ButtonText,
  MsgBox,
  MsgBoxCard,
  Line,
  Colors,
} from "../../components/styles";
import { Formik } from "formik";
import { View, Picker, Platform, ActivityIndicator } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../../components/keyboard-avoiding-wrapper";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";
import { CredentialsContext } from "../../components/credentials-context";
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
  const [loading, setLoading] = useState(false);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const getIdFromMascotas = async () => {
    const url = await AsyncStorage.getItem("urlGlobal");
    const token = await AsyncStorage.getItem("token");
    const idString = await AsyncStorage.getItem("idMascota");
    setIdMascota(idString);
    setUrlGlobal(url);
    setTokenState(token);
    ObtenerConsultasMedicas(url, token, idString);
  };
  const clearLogin = async () => {
    AsyncStorage.removeItem("token")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
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
        clearLogin();
      });
  };

  const DescargarFichaClinica = async () => {
    setLoading(true);
    const url = await AsyncStorage.getItem("urlGlobal");
    const token = await AsyncStorage.getItem("token");
    const idString = await AsyncStorage.getItem("idMascota");
    const urlObtenida =
      url +
      "/api/v1/Client/pets/" +
      parseInt(idString) +
      "/medicalconsultationpdf";

    let configAxios = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/pdf",
        Accept: "application/pdf",
      },
    };

    axios
      .get(urlObtenida, configAxios, { responseType: "application/pdf" })
      .then((response) => {
        if (response.status !== 200) {
          console.log("error al obtener información");
        } else {
          if (Platform.OS === "ios") {
            const downloadedFile = FileSystem.downloadAsync(
              urlObtenida,
              FileSystem.documentDirectory +
                "FichaClinica" +
                nombreMascota +
                ".pdf"
            )
              .then(({ uri }) => {
                const UTI = "public.pdf";
                const shareResult = Sharing.shareAsync(uri, { UTI });
                console.log("Finished downloading to ", uri);
              })
              .catch((error) => {
                console.error(error);
              });
            setLoading(false);
          } else {
            FileSystem.downloadAsync(
              urlObtenida,
              FileSystem.documentDirectory +
                "FichaClinica" +
                nombreMascota +
                ".pdf"
            )
              .then(({ uri }) => {
                console.log("Finished downloading to ", uri);
              })
              .catch((error) => {
                console.error(error);
              });
            setLoading(false);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
    setLoading(false);
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
              <StyledFormAreaCard>
                <MsgBox>Información sobre Atenciones Veterinarias </MsgBox>
                <Line />
                {dataObtenida.map((row, i) => (
                  <>
                    <Card key={i}>
                      <Card.Title key={i}>
                        <MsgBoxCard key={i}>
                          Veterinario : {row.Veterinarian.NameVeterinario}
                        </MsgBoxCard>
                      </Card.Title>
                      <Line />
                      <MsgBoxCard>
                        Fecha : <MsgBoxCard week> {row.Date}</MsgBoxCard>
                      </MsgBoxCard>

                      <MsgBoxCard>
                        Anamnesis :{" "}
                        <MsgBoxCard week>{row.Anamnesis} </MsgBoxCard>{" "}
                      </MsgBoxCard>
                      <MsgBoxCard>
                        Observaciones :{" "}
                        <MsgBoxCard week>{row.Observation}</MsgBoxCard>
                      </MsgBoxCard>
                      <MsgBoxCard>
                        Diagnostico :{" "}
                        <MsgBoxCard week>{row.Diagnosis}</MsgBoxCard>{" "}
                      </MsgBoxCard>
                      <MsgBoxCard>
                        Tratamiento :{" "}
                        <MsgBoxCard week>{row.Treatment}</MsgBoxCard>{" "}
                      </MsgBoxCard>

                      <MsgBoxCard>
                        RUT :{" "}
                        <MsgBoxCard week>
                          {row.Veterinarian.IdentityCard}
                        </MsgBoxCard>
                      </MsgBoxCard>
                      <MsgBoxCard>
                        Teléfono :{" "}
                        <MsgBoxCard week>
                          {row.Veterinarian.Telephone}
                        </MsgBoxCard>
                      </MsgBoxCard>
                      <Line />
                      {row.LstProducts.map((row1, i) => (
                        <>
                          <MsgBoxCard>
                            Nombre Producto :{" "}
                            <MsgBoxCard week>{row1.Name} </MsgBoxCard>
                          </MsgBoxCard>
                          <MsgBoxCard>
                            Descripción :{" "}
                            <MsgBoxCard week>{row1.Description}</MsgBoxCard>
                          </MsgBoxCard>
                          <MsgBoxCard>
                            Precio : <MsgBoxCard week>{row1.Price} </MsgBoxCard>
                          </MsgBoxCard>
                          <Line />
                        </>
                      ))}
                    </Card>
                  </>
                ))}
              </StyledFormAreaCard>
            )}
          </Formik>
          <StyledButton google onPress={DescargarFichaClinica}>
            {loading ? (
              <ActivityIndicator size="large" color={primary} />
            ) : (
              <ButtonText>Descargar Ficha en PDF</ButtonText>
            )}
          </StyledButton>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default FichaClinica;
