import * as React from 'react';
import { StackActions } from '@react-navigation/native';


export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();


export const navigate = (name, params) => {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.navigate(name, params);
    }
}

export const resetRootNavigator = () => {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.dispatch(
            StackActions.replace('RootNavigator')
          );
    }
}
