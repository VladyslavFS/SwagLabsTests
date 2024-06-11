class CheckoutCompletePage {
    get finishButton() { return $('#finish'); }
    get inventoryList() { return $('.inventory_list'); }
    get checkoutCompleteContainer() { return $('#checkout_complete_container'); }
    get completeMessage() { return $('.complete-header'); }
    get backHomeButton() { return $('#back-to-products'); }
    get checkoutTitle() { return 'Thank you for your order!'; }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async inventoryDisplayed() {
        return await this.inventoryList.isDisplayed();
    }

    async verifyCheckoutComplete() {
        expect(await this.checkoutCompleteContainer.isDisplayed()).toBe(true);
        expect(await this.completeMessage.getText()).toBe(this.checkoutTitle);
    }

    async backToInventory() {
        await this.backHomeButton.click();
    }
}

module.exports = new CheckoutCompletePage();
