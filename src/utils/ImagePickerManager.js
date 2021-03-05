import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Strings from '../themes/Strings';
import * as FlashManager from './FlashManager'
import { Typography } from '../styles/'
import AndroidPermissionManager from './AndroidPermissionManager';
import * as UtilityFunc from './UtilityFunc'

class ImagePickerManager {

    options = {
        mediaType: "photo",
        maxWidth: 300,
        maxHeight: 300
    };

    constructor() {

    }

    showCamera = (options = {}) => {
        let promise = new Promise(async (resolve, reject) => {
            const customOptions = { ...this.options, ...options }
            console.log(JSON.stringify(customOptions))

            if (UtilityFunc.IS_PLATFORM_ANDROID) {
                const isGranted = await AndroidPermissionManager.requestCameraPermission()
                if (isGranted) {
                    launchCamera(customOptions, (response) => {
                        if (response.didCancel) {
                            FlashManager.showErrorMessage(Strings.CanceledAction, "", { icon: null })
                        } else if (response.errorCode) {
                            console.log('ImagePicker Error: >>>', response.errorMessage);
                            this.handleError(response.errorCode)
                            reject(response.errorCode)
                        } else {
                            resolve(response)
                        }
                    })
                }
            } else {
                launchCamera(customOptions, (response) => {
                    if (response.didCancel) {
                        FlashManager.showErrorMessage(Strings.CanceledAction, "", { icon: null })
                    } else if (response.errorCode) {
                        console.log('ImagePicker Error: >>>', response.errorMessage);
                        this.handleError(response.errorCode)
                        reject(response.errorCode)
                    } else {
                        resolve(response)
                    }
                })
            }

        })
        return promise
    }

    showGallery = (options = {}) => {
        let promise = new Promise(async(resolve, reject) => {
            const customOptions = { ...this.options, ...options }
            console.log(JSON.stringify(customOptions))

            if (UtilityFunc.IS_PLATFORM_ANDROID) {
                const isGranted = await AndroidPermissionManager.requestGalleryPermission()
                if (isGranted) {
                    launchImageLibrary(customOptions, (response) => {
                        if (response.didCancel) {
                            FlashManager.showErrorMessage(Strings.CanceledAction, "")
                        } else if (response.errorCode) {
                            console.log('ImagePicker Error: >>>', response.errorMessage);
                            this.handleError(response.errorCode)
                            reject(response.errorCode)
                        } else {
                            resolve(response)
                        }
                    })
                }
            }else{
                //if platform iOS direct method call launch image library
                launchImageLibrary(customOptions, (response) => {
                    if (response.didCancel) {
                        FlashManager.showErrorMessage(Strings.CanceledAction, "")
                    } else if (response.errorCode) {
                        console.log('ImagePicker Error: >>>', response.errorMessage);
                        this.handleError(response.errorCode)
                        reject(response.errorCode)
                    } else {
                        resolve(response)
                    }
                })
            }
            
        })
        return promise
    }

    handleError = (errorCode) => {
        switch (errorCode) {
            case "camera_unavailable":
                FlashManager.showErrorMessage(Strings.CameraNotAvailable)
                break;
            case "permission":
                FlashManager.showErrorMessage(Strings.PermissionRequired, Strings.AllowCameraGalleryPermission)
                break;
            case "others":
                FlashManager.showErrorMessage(Strings.OopsSomethingWentWrong, Strings.PleaseTryAgainLaterWithPermission)
                break;
            default:
                break;
        }
    }

}

export default new ImagePickerManager()