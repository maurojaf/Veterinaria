import styled from "styled-components";
import { View, Text, Image, TextInput, Picker } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

export const Colors = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tertiary: "#1F2937",
  darklight: "#9CA3AF",
  brand: "#6D28D9",
  green: "#10B981",
  red: "#EF4444",
};

const { primary, secondary, tertiary, darklight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${primary};
`;

export const StyledContainerFicha = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${secondary};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PageLogo = styled.Image`
  width: 140px;
  height: 140px;
`;

export const UserImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  overflow: hidden;
  border-color: ${tertiary};
`;
export const PetImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 75px;
  overflow: hidden;
  border-color: ${tertiary};
  margin-bottom: 20px;
`;

export const CircleName = styled.Text`
  width: 90px;
  height: 90px;
  border-radius: 50px;
  border-color: ${tertiary};
  font-size: 50px;
  text-align: center;
  font-weight: bold;
  background: #099bdd;
  line-height: 110px;
  color: white;
  margin-bottom: 20px;
  display: flex;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${tertiary};
  padding: 10px;
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;

export const StyledPicker = styled.Picker`
  margin-vertical: 15px;
  margin-bottom: 15px;
  letter-spacing: 1px;
  font-size: 30px;
  color: ${tertiary};
`;

export const StyledFormArea = styled.View`
  width: 100%;
`;
export const StyledFormAreaCard = styled.View`
  width: 110%;
`;
export const StyledFormAreaImage = styled.View`
  align-items: center;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 5px;
  border-radius: 5px;
  font-size: 20px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
`;
export const StyledInputLabelMensaje = styled.Text`
  color: ${green};
  font-size: 13px;
  text-align: center;
`;

export const LeftIcon = styled.View`
  left: 15px;
  top: 30px;
  position: absolute;
  z-index: 1;
`;
export const LeftIconInput = styled.View`
  left: 15px;
  top: 15px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 10px;
  top: 30px;
  position: absolute;
  z-index: 1;
`;
export const RightIconWelcome = styled.TouchableOpacity`
  right: 40px;
  position: absolute;
  z-index: 1;
`;

export const RightIconTextBox = styled.TouchableOpacity`
  right: 10px;
  position: absolute;
  top: 15px;
  z-index: 1;
`;
export const RightIconLabel = styled.TouchableOpacity`
  right: 30px;
  position: absolute;
  top: -5px;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${red};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
  flex-direction: row;

  ${(props) =>
    props.google == true &&
    `
      background-color: ${green};
      flex-direction: row;
      justify-content : center;
      `}
  ${(props) =>
    props.usuario == true &&
    `
      background-color: ${brand};
      flex-direction: row;
      justify-content : center;
      `}
`;

export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 16px;

  ${(props) =>
    props.google == true &&
    `
      margin-left: 10px;
      
      `}
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 18px;
  color: ${(props) =>
    props.type == 200
      ? green
      : props.type === 500 || props.type === 404 || props.type === 401
      ? red
      : tertiary};
`;
export const MsgBoxCard = styled.Text`
  text-align: left;
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: 700;
  color: ${(props) =>
    props.type == 200
      ? green
      : props.type === 500 || props.type === 404 || props.type === 401
      ? red
      : tertiary};
  ${(props) =>
    props.week == true &&
    `
      font-weight: 400;
      `}
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darklight};
  margin-vertical: 10px;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${tertiary};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
  color: ${brand};
  font-size: 17px;
`;
