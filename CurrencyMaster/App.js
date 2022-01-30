import React from 'react';
import type { Node } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import CurrencyPage from './cm_app/scenes/CurrencyPage';
import CurrencyDetails from './cm_app/scenes/CurrencyDetails';
import SplashScreen from './cm_app/scenes/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown:false, animation: "slide_from_right"}}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animationEnabled: true }} />
        <Stack.Screen name="CurrencyPage" component={CurrencyPage} options={{ animationEnabled: true }} />
        <Stack.Screen name="CurrencyDetails" component={CurrencyDetails} options={{ animationEnabled: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
