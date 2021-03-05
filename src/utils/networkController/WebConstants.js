const URLS = {
    PRODUCTION : "http://wellness.projectstatus.in/api/",
    DEVELOPMENT : "http://wellnessdemo.projectstatus.in/api/"
}

const WebConstants = {
    //Api constants
    
    BASE_URL : (__DEV__) ? URLS.DEVELOPMENT : URLS.PRODUCTION,

    //Api keys

    kRegister : "User/Register",
    kLogin : "User/Login",
    kForgotPassword:"User/ForgotPassword",
    kActivityDetail:"Activity/GetActivityDetailBySubCatId",
    kGetCategoryOrSubcategoryList:"Master/GetCategoryOrSubcategroyList",
    kGetActivityList:"Activity/GetActivityList",
    kScheduleActivity:"Activity/ScheduleActivity",
    kGetCalenderScheduleActivityList:"Activity/GetCalenderScheduleActivityList",
    kGetActivityListByType:"Activity/GetActivityListByType",
    kPauseActivity:"Activity/PauseActivity",


    //Network code
    NetworkNoReachableStatusCode : 503,

}

export default WebConstants