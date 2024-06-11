class CartPage {
    get item() { return $('#item_4_title_link .inventory_item_name'); }
    get checkoutButton() { return $('button[data-test="checkout"]'); }
    get pageUrl() { return 'https://www.saucedemo.com/cart.html'; }

    async itemDisplayed() {
         return await this.item.isDisplayed();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async waitForPage() {
        await browser.waitUntil(async () => {
            return (await browser.getUrl()) === this.pageUrl;
        }, {
            timeout: 2000,
            timeoutMsg: 'Expected to be on cart page after 2s'
        });
    }
}

module.exports = new CartPage();
