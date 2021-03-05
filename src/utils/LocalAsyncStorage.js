import AsyncStorage from '@react-native-async-storage/async-storage'

const storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      console.log("Error in storing in asyncstorage",e.message)
    }
    console.log('store data in asyncstorage.')
}

const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value
    } catch(e) {
      console.log("Error in reading from asyncstorage",e.message)
    }
    console.log('get data from asyncstorage.')
}

const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch(e) {
      console.log("Error in removing from asyncstorage",e.message)
    }
  
    console.log('removed data from asyncstorage.')
  }



export {
    storeData,
    getData,
    removeData
}

