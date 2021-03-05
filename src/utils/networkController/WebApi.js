import axios from 'axios';
import Strings from '../../themes/Strings';
import WebConstants from './WebConstants'
import {ResponseModel} from '../../models/';


class WebApi {

    constructor() {

    }

    getRequest = (requestUrl = "", headers = {}) => {
        console.log("get request >>>> " + requestUrl + " headers >>>> " + JSON.stringify(headers))
        let promise = new Promise((resolve, reject) => {
            axios.get(requestUrl, {
                headers: headers,
                validateStatus: function (status) {
                    return status == 200
                },
            }).then((response) => {
                if (response.data !== undefined) {
                    console.log("api response >>>>" + JSON.stringify(response.data))
                    const responseModelObj = new ResponseModel(response.data);
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in get request>>>> url >>>> " + requestUrl + "========" + JSON.stringify(error))
                const errStatusObj = {
                    statusCode: 0,
                    statusTitle : "",
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 2xx
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusTitle = Strings.OopsSomethingWentWrong
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.CheckYourConnection
                    errStatusObj.statusTitle = Strings.CantConnectRightNow
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusTitle = Strings.SomeErrorOccured
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

    postRequest = (requestUrl = "", body = {}, headers = {}) => {
        console.log("post request >>>> " + requestUrl + " headers >>>> " + JSON.stringify(headers) + "body >>>>" + JSON.stringify(body))
        let promise = new Promise((resolve, reject) => {
            axios.post(requestUrl, body, {
                headers: headers,
                validateStatus: function (status) {
                    return status == 200
                },
            }).then((response) => {
                if (response.data !== undefined) {
                    console.log("api response >>>>" + JSON.stringify(response.data))
                    const responseModelObj = new ResponseModel(response.data);
                    resolve(responseModelObj)
                }
            }).catch((error) => {
                console.log("error in post request>>>> url >>>> " + requestUrl + "========" + JSON.stringify(error))
                const errStatusObj = {
                    statusCode: 0,
                    statusTitle : "",
                    statusMsg: ""
                }
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 2xx
                    */
                    errStatusObj.statusCode = error.response.status
                    errStatusObj.statusTitle = Strings.OopsSomethingWentWrong
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                    errStatusObj.statusCode = WebConstants.NetworkNoReachableStatusCode
                    errStatusObj.statusMsg = Strings.CheckYourConnection
                    errStatusObj.statusTitle = Strings.CantConnectRightNow
                    reject(errStatusObj)
                } else {
                    // Something happened in setting up the request and triggered an Error
                    errStatusObj.statusTitle = Strings.SomeErrorOccured
                    errStatusObj.statusMsg = error.message
                    reject(errStatusObj)
                }
            })
        })
        return promise
    }

}




export default new WebApi();