import React from 'react'
import { PermissionsAndroid } from 'react-native'

import Strings from '../themes/Strings'
import * as UtilityFunc from './UtilityFunc'
import * as FlashManager from './FlashManager'

class AndroidPermissionManager {

    static requestCameraPermission = () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Wellness app camera permission",
                        message: "Allow app to access camera for capturing profile photo",
                        buttonNegative: Strings.Cancel,
                        buttonPositive: Strings.Ok
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                } else {
                    resolve(false)
                    this.handleError(granted)
                }
            } catch (err) {
                console.log("error in camera permission>>>>>>>>>>", JSON.stringify(err))
            }
        })
        return promise
    }

    static requestGalleryPermission = async () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "Wellness app photo gallery permission",
                        message: "Allow app to access photo gallery for your profile photo",
                        buttonNegative: Strings.Cancel,
                        buttonPositive: Strings.Ok
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                } else {
                    resolve(false)
                    this.handleError(granted)
                }
            } catch (err) {
                console.warn(err);
            }
        });
        return promise
    }

    static handleError = (granted) => {
        switch (granted) {
            case PermissionsAndroid.RESULTS.DENIED:
                FlashManager.showErrorMessage(Strings.PermissionRequired, Strings.AllowCameraGalleryPermission,{duration:5000})
                break;
            case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
                FlashManager.showErrorMessage(Strings.OopsSomethingWentWrong, Strings.PleaseTryAgainLaterWithPermission,{duration:5000})
                break;
            default:
                break;
        }
    }


}

export default AndroidPermissionManager