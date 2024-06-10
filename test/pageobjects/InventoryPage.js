class InventoryPage {
    get addToCartButton() { return $('button[data-test="add-to-cart-sauce-labs-backpack"]'); }
    get cartBadge() { return $('.shopping_cart_badge'); }
    get item() { return $('#item_4_title_link .inventory_item_name'); }
    get priceElements() { return $$('.inventory_item_price[data-test="inventory-item-price"]'); }
    get cartButton() { return $('a[data-test="shopping-cart-link"]'); }
    get removeButton() { return $('[data-test="remove-sauce-labs-backpack"]'); }
    get resetAppStateButton() { return $('#reset_sidebar_link'); }

    async open() {
        await browser.url('https://www.saucedemo.com/inventory.html');
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
}

module.exports = new InventoryPage();
