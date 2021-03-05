import NetInfo from "@react-native-community/netinfo";


class NetworkUtils {

    constructor(){

    }

    static async isNetworkAvailable() {
        try {
            const response = await NetInfo.fetch();
            console.log("Netinfo status >>>>>",JSON.stringify(response))
            return response.isConnected;
        } catch (error) {
            console.log("Netinfo error >>>>>>>>>>",JSON.stringify(error))
        }
    }
}

export default NetworkUtils
