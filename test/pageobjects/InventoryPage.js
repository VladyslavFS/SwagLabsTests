class InventoryPage {
    get addToCartButton() { return $('button[data-test="add-to-cart-sauce-labs-backpack"]'); }
    get cartBadge() { return $('.shopping_cart_badge'); }
    get inventoryPageLink() { return 'https://www.saucedemo.com/inventory.html';}
    get item() { return $('#item_4_title_link .inventory_item_name'); }
    get priceElements() { return $$('.inventory_item_price[data-test="inventory-item-price"]'); }
    get cartButton() { return $('a[data-test="shopping-cart-link"]'); }
    get menuButton() { return $('#react-burger-menu-btn'); }
    get menuWrap() { return $('div.bm-menu-wrap'); }
    get removeButton() { return $('[data-test="remove-sauce-labs-backpack"]'); }
    get resetAppStateButton() { return $('#reset_sidebar_link'); }

    async open() {
        await browser.url('https://www.saucedemo.com/inventory.html');
    }

    async openSidebar() {
        this.menuButton.click();
    }

    async addItemToCart() {
        await this.addToCartButton.click();
    }

    async goToCart() {
        await this.cartButton.click();
    }

    async getProductPrice() {
        return this.priceElements[0].getText();
    }

    async resetAppState() {
        return this.resetAppStateButton.click();
    }

    async waitForPageOpen() {
        await browser.waitUntil(async () => {
            return (await browser.getUrl()) === this.inventoryPageLink;
        }, {
            timeout: 5000,
            timeoutMsg: 'Expected URL was not reached within 5 seconds'
        });
    }

    async waitDisplayWrap() {
        browser.waitUntil(() => this.menuWrap.getAttribute('aria-hidden') === 'false', {
            timeout: 5000,
            timeoutMsg: 'The menu wrap did not become visible within 5 seconds'
        });
    }
}

module.exports = new InventoryPage();
