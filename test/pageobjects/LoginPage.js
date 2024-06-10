class LoginPage {

    get inputUsername() {
         return $('#user-name'); 
        }

    get inputPassword() {
         return $('#password'); 
        }
        
    get btnLogin() {
         return $('#login-button'); 
        }

    async open() {
        await browser.url('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();
    }
}

module.exports = new LoginPage();
