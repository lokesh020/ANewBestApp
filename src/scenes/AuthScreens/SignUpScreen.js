import React, { useState, useCallback, memo, useEffect, useRef, createRef } from 'react'
import { View, Text, StyleSheet, Pressable, Image, findNodeHandle, ScrollView, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';



// Contexts
import AuthContext from './../../contexts/AuthContext'


// Custom Utilities
import ApiManager from '../../utils/ApiManager'
import * as Spinner from '../../utils/SpinnerRef'
import WebConstants from '../../utils/networkController/WebConstants';
import * as UtilityFunc from '../../utils/UtilityFunc'
import * as FlashManager from '../../utils/FlashManager'
import { Colors, Typography, Mixins } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';

// Custom Components
import InputWithLeftIcon from "../../components/InputWithLeftIcon";
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import TextButton from "../../components/TextButton";
import GenderPicker from '../../components/GenderPicker';
import ImagePickerModel from '../../components/ImagePickerModel';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';




const Gender = {
    MALE: Strings.Male,
    FEMALE: Strings.Female,
    OTHER: Strings.Other,
}

const imagePickerRef = createRef();
const genderPickerRef = createRef();
const dobDateTimePickerRef = createRef();

function SignUpScreen({ navigation }) {

    const { logIn } = React.useContext(AuthContext)

    const [selectedImgUri, setSelectedImgUri] = useState('')
    const [txtFullName, setTxtFullName] = useState("")
    const [txtEmail, setTxtEmail] = useState('')
    const [txtContactNumber, setTxtContactNumber] = useState('')
    const [selectedGender, setSelectedGender] = useState(Strings.SelectGender + "*")
    const [txtPassword, setTxtPassword] = useState('')
    const [selectedDob, setSelectedDob] = useState(null)

    const selectedImgBase64Ref = useRef(null) // behave as an instance variable
    const scrollViewRef = useRef(null) // behave as an instance variable
    const fullnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);


    const onBackPress = useCallback(() => {
        navigation.goBack()
    }, [])

    const onTapProfileImg = () => {
        imagePickerRef.current?.show()
    }

    const onSelectImage = ({ uri, base64, type }) => {
        const imageType = type.split('/')[1]
        console.log(">>>>>", base64)
        selectedImgBase64Ref.current = { imageType, base64 }
        setSelectedImgUri(uri)
    }

    const onChangeEmailText = (txt) => {
        setTxtEmail(txt)
    }

    const onChangeFullNameText = (txt) => {
        setTxtFullName(txt)
    }

    const onChangeContactNumberText = (txt) => {
        setTxtContactNumber(txt)
    }

    const onSelectGender = (item, index) => {
        setSelectedGender(item)
    }

    const onChangePasswordText = (txt) => {
        setTxtPassword(txt)
    }

    const onTapGenderInput = () => {
        genderPickerRef.current?.show()
    }

    const onTapDobInput = () => {
        dobDateTimePickerRef.current?.show()
    }

    //input submit editing methods
    const onFullNameSubmitEditing = () => {
        emailRef.current.focus()
    }

    const onEmailSubmitEditing = () => {
        passwordRef.current.focus()
    }


    const onPasswordSubmitEditing = () => {
        Keyboard.dismiss()
    }


    const onSubmitPress = () => {
        if (validateAllInputs()) {
            registerApiCall()
        }
    }

    const registerApiCall = () => {
        const body = {
            firstName: txtFullName.trim(),
            email: txtEmail.trim(),
            password: txtPassword.trim(),
            gender: (selectedGender == Gender.MALE) ? "M" : ((selectedGender == Gender.FEMALE) ? "F" : "O"),
            deviceType: Mixins.IS_PLATFORM_IOS ? 1 : 2,
            deviceToken: "string",
            phoneNumber: "",
            dob: null,
            profileImage: (selectedImgBase64Ref.current != null) ? selectedImgBase64Ref.current.base64 : null,
            extension: (selectedImgBase64Ref.current != null) ? selectedImgBase64Ref.current.imageType : null
        }
        ApiManager.makePostRequest(true, WebConstants.kRegister, body).then((response) => {
            FlashManager.showSuccessMessage(response.successMsg, "", { duration: 2500 })
            navigation.goBack()
        }).catch((errStatus) => {
        })
    }

    const validateAllInputs = () => {
        if (UtilityFunc.isStrEmpty(txtFullName.trim())) {
            FlashManager.showErrorMessage(Strings.FullNameRequired, Strings.FullNameEmptyValidation)
            return false
        } else if (UtilityFunc.isEqual(selectedGender, Strings.SelectGender + "*")) {
            FlashManager.showErrorMessage(Strings.GenderRequired, Strings.GenderSelectValidation)
            return false
        } else if (UtilityFunc.isStrEmpty(txtEmail.trim())) {
            FlashManager.showErrorMessage(Strings.EmailRequired, Strings.EmailEmptyValidation)
            return false
        } else if (UtilityFunc.isValidEmail(txtEmail.trim())) {
            FlashManager.showErrorMessage(Strings.WrongEmail, Strings.IncorrectEmailValidation)
            return false
        }
        else if (UtilityFunc.isStrEmpty(txtPassword.trim())) {
            FlashManager.showErrorMessage(Strings.PasswordRequired, Strings.PasswordEmptyValidation)
            return false
        } else if (UtilityFunc.isValidPassword(txtPassword.trim())) {
            FlashManager.showErrorMessage(Strings.WeakPassword, Strings.IncorrectPasswordalidation, { duration: 2700 })
            return false
        } else {
            return true
        }
    }

    useEffect(() => {
        return () => {

        }
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackgroundImage />
            <HeaderSignUp onBackPress={onBackPress} />
            <KeyboardAwareScrollView ref={ref => scrollViewRef.current = ref} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <CreateAccountText />
                    <ProfileImage imgUri={selectedImgUri} onSelectPress={onTapProfileImg} />
                    <FullNameInput value={txtFullName} onChange={onChangeFullNameText} customRef={fullnameRef} onSubmitEditing={onFullNameSubmitEditing} />
                    <SelectGenderInput value={selectedGender} onPress={onTapGenderInput} />
                    {/* <SelectedDobInput value={selectedDob} onPress={onTapDobInput} placeHolder = {Strings.SelectDob}/> */}
                    <EmailInput value={txtEmail} onChange={onChangeEmailText} customRef={emailRef} onSubmitEditing={onEmailSubmitEditing} />
                    {/* <ContactNumberInput value={txtContactNumber} onChange={(txt) => onChangeContactNumberText(txt)} /> */}
                    <PasswordInput value={txtPassword}
                        onChange={onChangePasswordText}
                        customRef={passwordRef}
                        onSubmitEditing={onPasswordSubmitEditing}
                    />
                    <SubmitButton onPress={onSubmitPress} />
                </View>
            </KeyboardAwareScrollView>
            <GenderPicker
                ref={genderPickerRef}
                data={[Gender.MALE, Gender.FEMALE, Gender.OTHER]}
                onBackDropHandler={() => genderPickerRef.current?.hide()}
                onSelect={(item, index) => onSelectGender(item, index)}
            />
            <ImagePickerModel
                ref={imagePickerRef}
                imageOptions={{ includeBase64: true }}
                onBackDropHandler={() => imagePickerRef.current?.hide()}
                onSelectImage={(response) => onSelectImage(response)}
            />
            <DateTimePicker
                ref={dobDateTimePickerRef}
                initialDate={UtilityFunc.getDateBefor18Year()}
                headerText={Strings.SelectDob}
                mode={"date"}
                maxDate={UtilityFunc.getDateBefor18Year()}
                onConfirm={(date) => {
                    setSelectedDob(date)
                }}
            />
        </SafeAreaView>
    )
}

const BackgroundImage = React.memo(() => {
    return (
        <Image source={Images.img_loginBg} style={styles.imageBG} resizeMode={"cover"} />
    )
})

const HeaderSignUp = React.memo(({ onBackPress = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <View style={styles.headerTextCont}>
                <Text style={styles.headerText}>{Strings.SignUp}</Text>
            </View>
            <Pressable style={styles.headerBackBtn} onPress={onBackPress}>
                <Icon name={Images.back_icon_name} size={30} />
            </Pressable>
        </View>
    )
})

const CreateAccountText = React.memo(() => {
    return (
        <Text style={styles.createAccountText}>{Strings.LetsCreateAccount}</Text>
    )
})

const ProfileImage = React.memo(({ imgUri = "", onSelectPress = () => { } }) => {
    const source = (imgUri == "") ? Images.img_dummy_profile : { uri: imgUri }
    return (
        <Pressable style={styles.btnProfileImg} onPress={onSelectPress}>
            <Image source={source} style={styles.imgProfile} resizeMode={"cover"} />
        </Pressable>
    )
})

const FullNameInput = ({ value, onChange, customRef, onSubmitEditing }) => {
    return (
        <InputWithLeftIcon inputContStyle={styles.inputContStyle}
            leftIcon={Images.user_name_icon}
            returnKeyType={"next"}
            customRef={customRef}
            onSubmit={onSubmitEditing}
            leftIconStyle={{ width: 22, height: 22 }}
            placeholder={Strings.FullName + "*"}
            maxLength={40}
            value={value}
            onChangeText={(txt) => onChange(txt)}
        />
    )
}
const EmailInput = ({ value, onChange, customRef, onSubmitEditing }) => {
    return (
        <InputWithLeftIcon inputContStyle={styles.inputContStyle}
            leftIcon={Images.email_icon}
            placeholder={Strings.EmailAddress + "*"}
            returnKeyType={"next"}
            onSubmit={onSubmitEditing}
            keyboardType="email-address"
            value={value}
            maxLength={250}
            customRef={customRef}
            onChangeText={(txt) => onChange(txt)}
        />
    )
}

const ContactNumberInput = ({ value, onChange }) => {
    return (
        <InputWithLeftIcon inputContStyle={styles.inputContStyle}
            leftIcon={Images.phone_icon}
            placeholder={Strings.ContactNumber}
            leftIconStyle={{ width: 22, height: 22 }}
            keyboardType="number-pad"
            value={value}
            onChangeText={(txt) => onChange(txt)}
        />
    )
}

const SelectGenderInput = ({ value, onPress = () => { } }) => {
    return (
        <Pressable style={styles.inputContStyle} onPress={onPress}>
            <View style={styles.genderleftIconCont}>
                <Image source={Images.gender_icon} style={styles.genderleftIcon} resizeMode={"contain"} />
            </View>
            <View style={{ flex: 0.70, marginLeft: 5 }}>
                <Text style={styles.genderText}>{value}</Text>
            </View>
            <View style={styles.genderRightIconCont}>
                <Icon name={Images.dropdown_icon_name} size={20} />
            </View>
        </Pressable>
    )
}

const SelectedDobInput = ({ value, placeHolder, onPress = () => { } }) => {

    const [txtDob, setTxtDob] = useState(placeHolder)

    useEffect(() => {
        //get dob string with format like "Jan, 20 2021"
        const getDobStr = (date) => {
            return UtilityFunc.getDateString(date, "DD-MM-YYYY")
        }
        if (value != null) {
            const dobStr = getDobStr(value)
            setTxtDob(dobStr)
        }
    }, [value])

    return (
        <Pressable style={styles.inputContStyle} onPress={onPress}>
            <View style={styles.genderleftIconCont}>
                <Image source={Images.gender_icon} style={styles.genderleftIcon} resizeMode={"contain"} />
            </View>
            <View style={{ flex: 0.70, marginLeft: 5 }}>
                <Text style={styles.dobText}>{txtDob}</Text>
            </View>
            <View style={styles.genderRightIconCont}>
                <Icon name={Images.dropdown_icon_name} size={20} />
            </View>
        </Pressable>
    )
}

const PasswordInput = ({ value, onChange, customRef, onSubmitEditing }) => {
    return (
        <InputWithLeftIcon inputContStyle={styles.inputContStyle}
            leftIcon={Images.password_icon}
            customRef={customRef}
            onSubmit={onSubmitEditing}
            placeholder={Strings.Password}
            returnKeyType={"done"}
            secureTextEntry={true}
            value={value}
            onChangeText={(txt) => onChange(txt)}
        />
    )
}

const SubmitButton = ({ onPress = () => { } }) => {


    return (
        <FilledButtonWithImg title={Strings.Submit} textStyle={styles.submitButtonText} style={styles.submitButton} onPress={onPress} />
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
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
    submitButton: {
        height: 50,
        width: "90%",
        marginVertical: 30
    },
    submitButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17
    },
    imageBG: {
        position: "absolute",
        width: "100%",
        height: Mixins.WINDOW_HEIGHT
    },
    imageLogo: {
        marginTop: 40,
        width: 110,
        height: 110,
    },
    imgProfile: {
        width: "100%",
        height: "100%",
        borderRadius: 65
    },
    inputContStyle: {
        height: 50,
        marginTop: Mixins.scaleRatio(2),
        marginHorizontal: 20,
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
        borderRadius: 8
    },
    createAccountText: {
        marginTop: Mixins.scaleRatio(0.5),
        fontSize: Typography.FONT_SIZE_15,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    btnProfileImg: {
        width: 130,
        height: 130,
        marginVertical: Mixins.scaleRatio(4),
        borderRadius: 65,
        justifyContent: "center",
        alignItems: "center"
    },
    btnSignUp: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center"
    },
    genderText: {
        fontSize: Typography.FONT_SIZE_14,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    dobText: {
        fontSize: Typography.FONT_SIZE_14,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    genderleftIcon: {
        marginLeft: 4,
        width: 22,
        height: 22,
        marginRight: 5,
    },
    genderleftIconCont: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    genderRightIconCont: {
        flex: 0.10,
        justifyContent: "center",
        alignItems: "center",
    }
})