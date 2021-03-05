// import messaging from '@react-native-firebase/messaging';


class NotificationManager {

    constructor(){
        this.initNotification()
    }

    initNotification = ()=> {
        this.checkPermission();
        this.onTokenRefresh()
    }


    //Check whether Push Notifications are enabled or not
    checkPermission = () => {
        messaging().hasPermission().then((enabled) => {
            if (enabled) {
                this.getToken();
            } else {
                this.requestUserPermission();
            }
        });
    }

    requestUserPermission = async() => {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Authorization status:>>>', authStatus);
          this.getToken()
        }
    }

    getInitialNotification = (callBack)=>{
        messaging().getInitialNotification().then(remoteMessage => {
                // console.log("get Initial Notification",remoteMessage.notification)
                callBack(remoteMessage)
        })
    }

    onNotificationTapped = (callBack)=>{
      this.unsubscribeTapNotifListener =  messaging().onNotificationOpenedApp(remoteMessage => {
            // console.log("Tapped Notification",remoteMessage)
            callBack(remoteMessage)
          });
    }


    // receive notification in foreground state
    getNotificationInForeground = (callBack) => {
        this.unsubscribeforegroundMsgListener = messaging().onMessage(async notif => {
            // console.log('A new FCM message arrived!', JSON.stringify(notif));
            callBack(notif)
        });
    }

    // receive data in background state
    // getNotificationInBackground = (callBack) => {
    //     this.foregroundMessages = messaging().setBackgroundMessageHandler(async remoteMessage => {
    //         callBack(notif)
    //     });
    // }

    //Get Device Registration Token
    getToken=()=> {
        messaging().getToken().then((fcmToken) => {
            if (fcmToken) {
                console.log('fcmToken:>>', fcmToken);
            }
        }).catch((err)=>{
            console.log(err.message)
        });
    }

    onTokenRefresh=()=>{
     this.unsubscribeTokenRefreshListener = messaging().onTokenRefresh((token)=>{
            console.log('refresh Token:>>>>', token);
        })
    }


}


export default NotificationManager


