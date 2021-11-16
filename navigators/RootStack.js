import React from "react";
import { Colors } from "../components/styles";
//REACT NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CredentialsContext } from "../components/credentials-context";
import Login from "../screens/login/login.uc";
import Mascotas from "../screens/listado-mascotas/mascotas.uc";
import FichaClinica from "../screens/fichaclinica/ficha-clinica.uc";

const { primary, tertiary } = Colors;

const Stack = createNativeStackNavigator();
const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent",
              },
              headerTintColor: tertiary,
              headerTransparent: true,
              headerTitle: "",
              headerLeftContainerStyle: {
                paddingLeft: 20,
              },
            }}
            initialRouteName="Login"
          >
            {storedCredentials ? (
              <>
                <Stack.Screen name="Mascotas" component={Mascotas} />
                <Stack.Screen name="FichaClinica" component={FichaClinica} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
