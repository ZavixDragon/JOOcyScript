function loginOnLoad() {
    new Login().create().print();
}

function Login() {
    this.create = () => {
        let usernameLabel = createLabel("Username:");
        let usernameInput = createTextInput();
        let passwordLabel = createLabel("Password:");
        let passwordInput = createPasswordInput();
        let errorLabel = createLabel("");
        let loginButton = createButton(() => {
            if (usernameInput.getElement().value === "username" && passwordInput.getElement().value === "password")
                //TODO: go to sample home screen
                location.reload();
            errorLabel.add(new Text("Invalid username or password"));
        }).add(new Text("Login"));
        return createContainer([usernameLabel, usernameInput, passwordLabel, passwordInput, loginButton, errorLabel]);
    };
}