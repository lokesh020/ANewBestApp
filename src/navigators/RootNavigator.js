import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthContext from '../contexts/AuthContext';
import * as SessionManager from '../utils/SessionManager';

import AuthLoading from '../scenes/AuthLoading'
import AuthNavigator from './AuthNavigator'
import HomeNavigator from './HomeNavigator'
import { ActivityDetail } from '../scenes';




const Stack = createStackNavigator();

function RootNavigator({ navigation }) {

    const [state, dispatch] = React.useReducer(
        AuthReducer, {
        isLoading: true,
        isLoggedIn: false,
        token: null,
    }
    )

    React.useEffect(() => {
        const getAuthToken = async () => {
            let loginModel = await SessionManager.getLoginModel()
            dispatch({ type: 'RESTORE_TOKEN', token: (loginModel != null) ? loginModel.authorizationToken : null })
        }
        getAuthToken()
    }, [])

    const authContextValue = React.useMemo(
        () => ({
            logIn: async (loginModel) => {
                await SessionManager.setLoginModel(loginModel)
                dispatch({ type: 'LOG_IN', token: loginModel.authorizationToken });
            },
            logOut: async () => {
                await SessionManager.removeLoginModel()
                dispatch({ type: 'LOG_OUT', token: null });
            }
        }),
        []
    );

    return (
        <AuthContext.Provider value={authContextValue}>
            <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
                {
                    (state.isLoading) ? <Stack.Screen name="AuthLoading" component={AuthLoading} /> : (state.token == null) ?
                        <Stack.Screen name="AuthNavigator" component={AuthNavigator} /> :
                        <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
                }
            </Stack.Navigator>
        </AuthContext.Provider>
    )

}


const AuthReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                token: action.token,
                isLoading: false,
            };
        case 'LOG_IN':
            return {
                ...prevState,
                isLoggedIn: true,
                token: action.token,
            };
        case 'LOG_OUT':
            return {
                ...prevState,
                isLoggedIn: false,
                token: null,
            };
    }
}


export default RootNavigator
