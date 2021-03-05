import NetworkUtils from './NetworkUtils'
import * as FlashManager from './FlashManager'
import * as NavigationObject from './NavigationObject'
import * as SpinnerRef from './SpinnerRef'
import WebApi from './networkController/WebApi'
import WebConstants from './networkController/WebConstants'
import * as SessionManager from './SessionManager'
import * as UtilityFunc from './UtilityFunc'
import Strings from '../themes/Strings'


class ApiManager {

    constructor() {

    }

    //Private method
    getAuthToken = async () => {
        const loginModel = await SessionManager.getLoginModel()
        if (loginModel != null)
            return loginModel.authorizationToken
        else
            return null
    }

    //Private method
    getNetworkErrorObj = () => {
        const errStatusObj = { statusCode: 0, statusTitle: "", statusMsg: "" }
        errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
        errStatusObj.statusMsg = Strings.CheckYourConnection
        errStatusObj.statusTitle = Strings.CantConnectRightNow
        return errStatusObj
    }

    makeGetRequest = (isSpinnerShow = false, kApiPath = "", headers = {}) => {
        let promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()

            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                this.handleApiError(errStatusObj)
                reject(errStatusObj)
                return
            }

            let reqUrl = WebConstants.BASE_URL + kApiPath
            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + await this.getAuthToken(),
                ...headers
            }
            if (isSpinnerShow) {
                SpinnerRef.show()
            }
            WebApi.getRequest(reqUrl, defaultHeaders).then((response) => {
                if (isSpinnerShow) {
                    SpinnerRef.hide()
                }
                if (response.responseCode == 200) {
                    resolve(response)
                } else {
                    FlashManager.showErrorMessage(response.failureMsg == "" ? response.successMsg : response.failureMsg)
                }
            }).catch((errStatus) => {
                if (isSpinnerShow) {
                    SpinnerRef.hide()
                }
                this.handleApiError(errStatus)
                if (errStatus.statusCode != 401){
                    reject(errStatus)
                }
            })
        })
        return promise
    }

    makePostRequest = (isSpinnerShow = false, kApiPath = "", body = {}, headers = {}) => {
        let promise = new Promise(async (resolve, reject) => {

            const isNetAvailable = await NetworkUtils.isNetworkAvailable()
            
            if (isNetAvailable == false) {
                const errStatusObj = this.getNetworkErrorObj()
                this.handleApiError(errStatusObj)
                reject(errStatusObj)
                return
            }

            let reqUrl = WebConstants.BASE_URL + kApiPath
            const defaultHeaders = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + await this.getAuthToken(),
                ...headers
            }
            if (isSpinnerShow) {
                SpinnerRef.show()
            }
            WebApi.postRequest(reqUrl, body, defaultHeaders).then((response) => {
                if (isSpinnerShow) {
                    SpinnerRef.hide()
                }
                if (response.responseCode == 200) {
                    resolve(response)
                } else {
                    FlashManager.showErrorMessage(response.failureMsg == "" ? response.successMsg : response.failureMsg)
                }
            }).catch((errStatus) => {
                if (isSpinnerShow) {
                    SpinnerRef.hide()
                }
                this.handleApiError(errStatus)
                if (errStatus.statusCode != 401){
                    reject(errStatus)
                }
            })
        })
        return promise
    }


    //Error Handling (Private Method)
    handleApiError = (errStatus) => {
        switch (errStatus.statusCode) {
            case 401:
                this.performSessionTimeout()
                break;
            case 404:
                FlashManager.showErrorMessage(errStatus.statusTitle, errStatus.statusMsg)
                break;
            default:
                FlashManager.showErrorMessage(errStatus.statusTitle, errStatus.statusMsg)
                break;
        }
    }

    /**
     * Session time out and log out from the app if status code is 401
     */

     performSessionTimeout = () => {
        FlashManager.showErrorMessage(Strings.SessionTimeOutTitle, Strings.SessionTimeOutMsg)
        this.logoutFromApp()
     }

    logoutFromApp = async()=>{
        await SessionManager.removeLoginModel()
        NavigationObject.resetRootNavigator()
    }
     
     


}




export default new ApiManager();