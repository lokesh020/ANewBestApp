import * as React from 'react';

export const spinnerRef = React.createRef();


export const show = () => {
    if (spinnerRef.current) {
        spinnerRef.current.show()
    }
}

export const hide = () => {
    if (spinnerRef.current) {
        spinnerRef.current.hide()
    }
}
