import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from "@sentry/react-native";
import SplashScreen from 'react-native-splash-screen';

import { navigationRef, isReadyRef } from './utils/NavigationObject';
import { spinnerRef } from './utils/SpinnerRef';
import * as UtilityFunc from './utils/UtilityFunc'

import { SplashScreenComp } from './scenes/'
import RootNavigator from './navigators/RootNavigator'
import SpinnerModal from './components/SpinnerModal';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';



const Stack = createStackNavigator();

function Index() {

  React.useEffect(() => {

    return () => {
      isReadyRef.current = false
    };
  }, []);


  return (
    <SafeAreaProvider>

      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}>
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
          <Stack.Screen name="SplashScreenComp" component={SplashScreenComp} />
          <Stack.Screen name="RootNavigator" component={RootNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
      <SpinnerModal ref={spinnerRef} />

    </SafeAreaProvider>

  )
}

const App = () => {
  useEffect(() => {
    SplashScreen.hide()
    if (UtilityFunc.IS_PLATFORM_ANDROID) {
      StatusBar.setBackgroundColor("white")
      StatusBar.setBarStyle("dark-content") 
    }
    if (__DEV__){
      console.log("application in dev mode>>>>>")
      LogBox.ignoreLogs([
        'Require cycle:'
      ])
    }else{

      //application in release mode
      Sentry.init({
        dsn: "https://04386fa646e6486787136271b31ff5b8@o412338.ingest.sentry.io/5593816",
      });
    }
  }, [])


  return (
    <GlobalErrorBoundary>
      <Index />
      <FlashMessage />
    </GlobalErrorBoundary>
  )
}


export default App;