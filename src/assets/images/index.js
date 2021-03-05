import {Mixins} from '../../styles/'


const Images = {
    img_splash : require('./launch_screen.png'),
    img_btnBgGradient : require('./btnBgGradient.png'),
    img_loginBg : require('./loginBackground.png'),
    img_logo_circle : require('./logo_circle.png'),
    img_dummy_profile : require('./dummy_profile_img.png'),
    img_forgot_password : require('./img_forgotPassword.png'),
    img_backButton : require('./img_backButton.png'),
    img_demo : require('./img_demo.png'),
    img_wellness_activity_logo : require('./wellness_activity_logo_img.png'),
    img_myactivity_progress_circle : require('./myActivityProgressCircleImg.png'),

    //icons 

    back_icon_name : Mixins.IS_PLATFORM_IOS ? "ios-chevron-back" : "arrow-back" ,
    dropdown_icon_name : "ios-chevron-down-outline" ,
    
    today_calendar_icon : require('./icons/today_calendar_icon.png'),
    sad_cloud_icon : require('./icons/sad_cloud_icon.png'),
    retry_again_icon : require('./icons/retry_again_icon.png'),
    user_name_icon : require('./icons/user_name_icon.png'),
    calendar_icon : require('./icons/calendar_icon.png'),
    notification_icon : require('./icons/notification_icon.png'),
    dashboard_unselected_icon : require('./icons/dashboard_unselected_icon.png'),
    my_activity_unselected_icon : require('./icons/my_activity_unselected_icon.png'),
    credits_unselected_icon : require('./icons/credits_unselected_icon.png'),
    profile_unselected_icon : require('./icons/profile_unselected_icon.png'),
    gender_icon : require('./icons/gender_icon.png'),
    phone_icon : require('./icons/phone_icon.png'),
    email_icon : require('./icons/email_icon.png'),
    password_icon : require('./icons/password_icon.png'),
    no_icon : require('./icons/no_icon.png'),
    tickmark_icon : require('./icons/tickmark_icon.png'),
    audio_icon : require('./icons/audio_icon.png'),
    video_icon : require('./icons/video_icon.png'),
    pdf_icon : require('./icons/pdf_icon.png'),
    play_icon : require('./icons/play_icon.png'),
    play_timer_icon : require('./icons/play_timer_icon.png'),
    pause_timer_icon : require('./icons/pause_timer_icon.png'),
}

export default Images