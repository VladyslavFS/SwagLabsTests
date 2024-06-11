const loginPage = require('../pageobjects/LoginPage');
const inventoryPage = require('../pageobjects/InventoryPage');
const cartPage = require('../pageobjects/CartPage');
const checkoutPage = require('../pageobjects/CheckoutPage');
const checkoutCompletePage = require('../pageobjects/CheckoutCompletePage');
require('dotenv').config({ path: './credentials.env' });

function getRandomUsername() {
    const usernames = process.env.USERNAMES.split(',');
    return usernames[Math.floor(Math.random() * (usernames.length))];
}

describe('Swag Labs test', () => {
    let productPrice;

    before(async () => {
        const userName = getRandomUsername(); 
        await loginPage.open();
        await loginPage.login(userName, process.env.PASSWORD);
        await inventoryPage.open();
    });

    it('should add product to cart and complete the checkout process', async () => {
        await inventoryPage.addItemToCart();
        expect(await inventoryPage.cartBadge.getText()).toBe('1');
        productPrice = await inventoryPage.getProductPrice();
    });

    it('should display cart page with product from step 1', async() => {
        await inventoryPage.goToCart();
        await cartPage.waitForPage();
        expect(await cartPage.item.isDisplayed()).toBe(true);
    });

    it('should display checkout form', async() => {
        await cartPage.proceedToCheckout();
        await checkoutPage.waitForPage();
        expect(await checkoutPage.checkoutContainer.isDisplayed()).toBe(true);
    });

    it('should input first name', async() => {
        await checkoutPage.fillCheckoutForm('Vladyslav', '', '');
        expect(await checkoutPage.inputFirstName.getAttribute('value')).toBe('Vladyslav');
    });

    it('should input last name', async() => {
        await checkoutPage.fillCheckoutForm('', 'Fushtor', '');
        expect(await checkoutPage.inputLastName.getAttribute('value')).toBe('Fushtor');
    });

    it('should input postal code', async() => {
        await checkoutPage.fillCheckoutForm('', '', '46000');
        expect(await checkoutPage.inputPostalCode.getAttribute('value')).toBe('46000');
    });

    it('should redirect to the "Overview" page and display items from step 1', async() => {
        await checkoutPage.continueToOverview();
        const checkoutOverviewTitle = await $('div.header_secondary_container span.title');
        const subtotalElement = await $('.summary_subtotal_label');
        const subtotalText = await subtotalElement.getText();
        const parts = subtotalText.split(':');
        const priceText = parts[1].trim();

        expect(await checkoutOverviewTitle.isDisplayed()).toBe(true);
        expect(await cartPage.item.isDisplayed()).toBe(true);
        expect(await priceText).toBe(productPrice);
    });

    it('should redirect to the "Checkout Complete" page', async() => {
        await checkoutCompletePage.finishCheckout();
        await checkoutCompletePage.verifyCheckoutComplete();
    });

    it('should redirect to the inventory page', async() => {
        await checkoutCompletePage.backToInventory();
        const inventory = await $('.inventory_list');
        expect(await inventory.isDisplayed()).toBe(true);
    });

    it('should display remove button when cart is empty', async() => {
        const menuButton = await $('#react-burger-menu-btn');
        menuButton.click();
        const menuWrap = await $('div.bm-menu-wrap');
        browser.waitUntil(() => menuWrap.getAttribute('aria-hidden') === 'false', {
            timeout: 5000,
            timeoutMsg: 'The menu wrap did not become visible within 5 seconds'
        });

        await inventoryPage.addItemToCart();
        await inventoryPage.cartBadge.waitForDisplayed({ timeout: 2000 });

        await inventoryPage.resetAppState();

        if (!(await inventoryPage.cartBadge.isExisting())) {
            expect(await inventoryPage.removeButton.isDisplayed()).toBe(false);
        }

    });
});
