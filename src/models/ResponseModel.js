class ResponseModel {

    data;
    responseCode;
    successMsg;
    failureMsg;
    validationErrors;
    apiName;

    constructor(props) {
        if (props) {
            this.data = props.data
            this.responseCode = props.responseCode ?? 0;
            this.successMsg = props.successMsg ?? "";
            this.failureMsg = props.failureMsg ?? "";
            this.validationErrors = props.validationErrors ?? [];
            this.apiName = props.apiName ?? "";

        }
    }

}

export default ResponseModel