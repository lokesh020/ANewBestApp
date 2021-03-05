import {showMessage,hideMessage} from 'react-native-flash-message';
import { Typography,Colors} from '../styles/'

export const showErrorMessage = (message,description,props = {}) => {
    showMessage({
        message: message ?? "Default",
        description: description,
        titleStyle: {fontSize : Typography.FONT_SIZE_15,fontFamily: Typography.FONT_FAMILY_MEDIUM},
        textStyle: {fontSize : Typography.FONT_SIZE_16,fontFamily: Typography.FONT_FAMILY_REGULAR},
        // icon: { icon: "auto", position: "left" },
        position : "bottom",
        backgroundColor : Colors.ALERT,
        duration : 2100,
        ...props
      });
}

export const showSuccessMessage = (message,description,props = {}) => {
    showMessage({
        message: message ?? "Default",
        description: description,
        titleStyle: {fontSize : Typography.FONT_SIZE_15,fontFamily: Typography.FONT_FAMILY_MEDIUM},
        textStyle: {fontSize : Typography.FONT_SIZE_16,fontFamily: Typography.FONT_FAMILY_REGULAR},
        type: "success",
        position : "bottom",
        ...props
      });
}
