import React, { useState, useCallback, memo, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'

// Contexts
import AuthContext from './../../contexts/AuthContext'
import SpinnerModalContext from "../../contexts/SpinnerModalContext";

// Custom Utilities
import * as SessionManager from '../../utils/SessionManager'
import * as UtilityFunc from '../../utils/UtilityFunc'
import * as FlashManager from '../../utils/FlashManager'
import { Colors, Typography, Mixins, Fonts } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';

// Custom Components
import InputWithLeftIcon from "../../components/InputWithLeftIcon";
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import TextButton from "../../components/TextButton";



function ChangePassword({ navigation }) {

    const { logIn } = React.useContext(AuthContext)
    const Spinner = React.useContext(SpinnerModalContext)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const onChangeEmailText = (txt) => {
        setTxtEmail(txt)
    }

    const onSubmitButtonPress = useCallback(() => {
        FlashManager.showErrorMessage("Email Invalid", "Please enter valid email id")
    }, [])

    const onBackPressButton = useCallback(() => {
        navigation.goBack();
    }, [])


    console.log("Change Password render>>>>")

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackgroundImage />
            <HeaderChangePassword onBackPress={onBackPressButton} />
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <PasswordInput placeholder={Strings.oldPassword} value={oldPassword} onChange={(txt) => onChangeEmailText(txt)} />
                    <PasswordInput placeholder={Strings.newPassword} value={newPassword} onChange={(txt) => onChangeEmailText(txt)} />
                    <PasswordInput placeholder={Strings.confirmPassword} value={confirmNewPassword} onChange={(txt) => onChangeEmailText(txt)} />
                    <SubmitButton onPress={onSubmitButtonPress} />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const BackgroundImage = React.memo(() => {
    console.log("BackgroundImage render")
    return (
        <Image source={Images.img_loginBg} style={styles.imageBG} resizeMode={"cover"} />
    )
})



const PasswordInput = ({ value, onChange, placeholder }) => {
    console.log("Password Input render>>>>", value)
    return (
        <InputWithLeftIcon inputContStyle={styles.inputContStyle}
            leftIcon={Images.password_icon}
            placeholder={placeholder}
            keyboardType="email-address"
            value={value}
            onChangeText={(txt) => onChange(txt)}
        />
    )
}

const HeaderChangePassword = React.memo(({ onBackPress = () => { } }) => {
    console.log("HeaderSignUp render")
    return (
        <View style={styles.headerCont}>
            <Pressable onPress={onBackPress}>
                <Image source={Images.img_backButton} style={styles.headerBackBtnImg} />
            </Pressable>
            <View style={styles.headerTextCont}>
                <Text style={styles.headerText}>{Strings.ChangePassword}</Text>
            </View>
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

export default ChangePassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    SubmitButton: {
        marginTop: 30,
        height: Mixins.scaleRatio(5.8),
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
        marginTop: Mixins.scaleRatio(3),
        width: Mixins.scaleRatio(29),
        height: Mixins.scaleRatio(32),
    },
    inputContStyle: {
        height: Mixins.scaleRatio(5.8),
        marginTop: Mixins.scaleRatio(2),
        fontFamily: Fonts.FONT_FAMILY_REGULAR
    },

    welcomeTextCont: {
        marginTop: Mixins.scaleRatio(6),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Mixins.scaleRatio(2)
    },
    welcomeText: {
        fontSize: Typography.FONT_SIZE_24,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    loginToContinueText: {
        marginTop: Mixins.scaleRatio(1.8),
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    headerCont: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerBackBtnImg: {
        width: Mixins.scaleRatio(12),
        resizeMode: 'contain',
        height: Mixins.scaleRatio(2.5),
    },
    headerText: {
        marginLeft: Mixins.scaleRatio(2),
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    }

})