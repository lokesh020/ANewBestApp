import LoginModel from '../models/LoginModel'
import {storeData,getData, removeData} from './LocalAsyncStorage'

export const setLoginModel = async (data) => {
    await storeData('@LOGIN_DATA', JSON.stringify(data))
    return
}

export const getLoginModel = async () => {
    const loginData = await getData('@LOGIN_DATA')
    if (loginData !== null) {
        const parsedData = JSON.parse(loginData)
        let model = new LoginModel(parsedData)
        return model
    }else{
        console.log('login data is null')
        return loginData
    }
}

export const removeLoginModel = async () => {
    await removeData('@LOGIN_DATA')
}
