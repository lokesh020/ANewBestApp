class LoginModel {

    name;
    email;
    profileImage;
    authorizationToken;
    tokenExpiredOn;

    constructor(props) {
        if (props) {
            this.name = props.name ?? ""
            this.email = props.email ?? "";
            this.profileImage = props.profileImage ?? "";
            this.authorizationToken = props.authorizationToken ?? "";
            this.tokenExpiredOn = props.tokenExpiredOn ?? "";
        }
    }

}

export default LoginModel

