import React, { useState, useCallback, memo, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'
import Icon from 'react-native-vector-icons/Ionicons';

// Contexts
import AuthContext from './../../contexts/AuthContext'
import SpinnerModalContext from "../../contexts/SpinnerModalContext";

// Custom Utilities
import ApiManager from '../../utils/ApiManager'
import * as SessionManager from '../../utils/SessionManager'
import * as UtilityFunc from '../../utils/UtilityFunc'
import * as FlashManager from '../../utils/FlashManager'
import WebConstants from '../../utils/networkController/WebConstants';
import { Colors, Typography, Mixins, Fonts } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';

// Custom Components
import InputWithLeftIcon from "../../components/InputWithLeftIcon";
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import TextButton from "../../components/TextButton";



function ForgotPassword({ navigation }) {

    const [txtEmail, setTxtEmail] = useState('')

    const onChangeEmailText = (txt) => {
        setTxtEmail(txt)
    }

    const onBackPressButton = useCallback(() => {
        navigation.goBack();
    }, [])


    const onSubmitPress = () => {
        if (UtilityFunc.isStrEmpty(txtEmail)) {
            FlashManager.showErrorMessage(Strings.EmailRequired, Strings.EmailEmptyValidation)
        }
        else if (UtilityFunc.isValidEmail(txtEmail)) {
            FlashManager.showErrorMessage(Strings.WrongEmail, Strings.IncorrectEmailValidation)
        }
        else {
            forgotApiCall()
        }
    }

    const forgotApiCall = () => {
        const body = {
            emailID: txtEmail.trim()
        }
        ApiManager.makePostRequest(true, WebConstants.kForgotPassword, body).then((response) => {
            UtilityFunc.showAlertWithSingleAction(response.successMsg, () => { navigation.goBack() })

        }).catch((errStatus) => {
        })
    }


    console.log("Forgot render>>>>")

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackgroundImage />
            <HeaderForgotPassword onBackPress={onBackPressButton} />
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ForgotLogo />
                    <ForgotPasswordText />
                    <EmailInput value={txtEmail} onChange={(txt) => onChangeEmailText(txt)} />
                    <SubmitButton onPress={onSubmitPress} />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const BackgroundImage = React.memo(() => {
    console.log("Forgot BackgroundImage render")
    return (
        <Image source={Images.img_loginBg} style={styles.imageBG} resizeMode={"cover"} />
    )
})

const ForgotLogo = React.memo(() => {
    console.log("ForgotLogo render")
    return (
        <Image source={Images.img_forgot_password} style={styles.imageLogo} resizeMode={"contain"} />
    )
})

const ForgotPasswordText = React.memo(() => {
    console.log("ForgotPasswordText render")
    return (
        <View style={styles.welcomeTextCont}>
            <Text style={styles.welcomeText}>{Strings.forgotYourPassword}</Text>
            <Text style={styles.enterYourEmail}>{Strings.enterYourEmail}</Text>
        </View>
    )
})

const EmailInput = ({ value, onChange }) => {
    console.log("Email Input render>>>>", value)
    return (
        <InputWithLeftIcon inputContStyle={styles.inputContStyle}
            leftIcon={Images.email_icon}
            placeholder={Strings.email}
            keyboardType="email-address"
            value={value}
            onChangeText={(txt) => onChange(txt)}
        />
    )
}


const HeaderForgotPassword = React.memo(({ onBackPress = () => { } }) => {
    console.log("HeaderSignUp render")
    return (
        <View style={styles.headerCont}>
            <View style={styles.headerTextCont}>
                <Text style={styles.headerText}>{Strings.ForgotPassword}</Text>
            </View>
            <Pressable style={styles.headerBackBtn} onPress={onBackPress}>
                <Icon name={Images.back_icon_name} size={30} />
            </Pressable>
        </View>
    )
})


const SubmitButton = memo(({ onPress = () => { } }) => {

    console.log("SubmitButton render")

    return (
        <FilledButtonWithImg title={Strings.submit} textStyle={styles.SubmitButtonText} style={styles.SubmitButton} onPress={onPress} />
    )
})


const onBackPress = () => {
    navigation.goBack()
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    SubmitButton: {
        marginTop: 30,
        height: 50,
        width: "100%"
    },
    SubmitButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17
    },
    imageBG: {
        position: "absolute",
        width: "100%",
        height: Mixins.WINDOW_HEIGHT
    },
    imageLogo: {
        marginTop: Mixins.scaleRatio(1),
        width: Mixins.scaleRatio(26),
        height: Mixins.scaleRatio(30),
    },
    inputContStyle: {
        height: 50,
        marginTop: Mixins.scaleRatio(2),
        fontFamily: Fonts.FONT_FAMILY_REGULAR
    },

    welcomeTextCont: {
        marginTop: Mixins.scaleRatio(5),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Mixins.scaleRatio(2)
    },
    welcomeText: {
        fontSize: Typography.FONT_SIZE_24,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    enterYourEmail: {
        marginTop: Mixins.scaleRatio(1.8),
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    headerCont: {
        width: "100%",
        justifyContent: "center",
        height: 55,
    },
    headerTextCont: {
        width: "100%",
        height: 55,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute"
    },
    headerBackBtn: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8
    },
    headerText: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_18
    },

})