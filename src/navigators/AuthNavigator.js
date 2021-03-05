import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen, SignUpScreen, ForgotPassword, ChangePassword } from '../scenes/'



const Stack = createStackNavigator();

function AuthStackNav() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    )

}

export default AuthStackNav