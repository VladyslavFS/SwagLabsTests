class CheckoutPage {
    get inputFirstName() { return $('#first-name'); }
    get inputLastName() { return $('#last-name'); }
    get inputPostalCode() { return $('#postal-code'); }
    get continueButton() { return $('#continue'); }
    get checkoutContainer() { return $('#checkout_info_container'); }
    get overviewTitle() { return $('div.header_secondary_container span.title'); }
    get subTotalElement() { return $('.summary_subtotal_label'); }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.inputFirstName.addValue(firstName);
        await this.inputLastName.addValue(lastName);
        await this.inputPostalCode.addValue(postalCode);
    }

    async continueToOverview() {
        await this.continueButton.click();
    }

    async getSubtotalText() {
        return await this.subTotalElement.getText();
    }

    async titleDisplayed() {
        return this.overviewTitle.isDisplayed();
    }

    async waitForPage() {
        await browser.waitUntil(async() => {
            return (await browser.getUrl()) === 'https://www.saucedemo.com/checkout-step-one.html';
        }, {
            timeout: 2000,
            timeoutMsg: 'Expected to be on page after 2s'
        });
    }

}

module.exports = new CheckoutPage();
