class CheckoutCompletePage {
    get finishButton() { return $('#finish'); }
    get checkoutCompleteContainer() { return $('#checkout_complete_container'); }
    get completeMessage() { return $('.complete-header'); }
    get backHomeButton() { return $('#back-to-products'); }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async verifyCheckoutComplete() {
        expect(await this.checkoutCompleteContainer.isDisplayed()).toBe(true);
        expect(await this.completeMessage.getText()).toBe('Thank you for your order!');
    }

    async backToInventory() {
        await this.backHomeButton.click();
    }
}

module.exports = new CheckoutCompletePage();
