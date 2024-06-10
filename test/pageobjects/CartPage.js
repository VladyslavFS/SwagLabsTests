class CartPage {
    get item() { return $('#item_4_title_link .inventory_item_name'); }
    get checkoutButton() { return $('button[data-test="checkout"]'); }

    async waitForPage() {
        await browser.waitUntil(async () => {
            return (await browser.getUrl()) === 'https://www.saucedemo.com/cart.html';
        }, {
            timeout: 2000,
            timeoutMsg: 'Expected to be on cart page after 2s'
        });
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}

module.exports = new CartPage();
