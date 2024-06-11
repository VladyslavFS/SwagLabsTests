const { faker } = require('@faker-js/faker');
const cartPage = require('../pageobjects/CartPage');
const checkoutPage = require('../pageobjects/CheckoutPage');
const checkoutCompletePage = require('../pageobjects/CheckoutCompletePage');
const loginPage = require('../pageobjects/LoginPage');
const inventoryPage = require('../pageobjects/InventoryPage');
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
        await inventoryPage.waitForPageOpen();
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
        const firstName = faker.name.firstName();
        await checkoutPage.fillCheckoutForm(firstName, '', '');
        expect(await checkoutPage.inputFirstName.getAttribute('value')).toBe(firstName);
    });

    it('should input last name', async() => {
        const lastName = faker.name.lastName();
        await checkoutPage.fillCheckoutForm('', lastName, '');
        expect(await checkoutPage.inputLastName.getAttribute('value')).toBe(lastName);
    });

    it('should input postal code', async() => {
        const postalCode = faker.address.zipCode();
        await checkoutPage.fillCheckoutForm('', '', postalCode);
        expect(await checkoutPage.inputPostalCode.getAttribute('value')).toBe(postalCode);
    });

    it('should redirect to the "Overview" page and display items from step 1', async() => {
        await checkoutPage.continueToOverview();
        const subtotalText = await checkoutPage.getSubtotalText();
        const parts = subtotalText.split(':');
        const priceText = parts[1].trim();

        expect(await checkoutPage.titleDisplayed()).toBe(true);
        expect(await cartPage.itemDisplayed()).toBe(true);
        expect(priceText).toBe(productPrice);
    });

    it('should redirect to the "Checkout Complete" page', async() => {
        await checkoutCompletePage.finishCheckout();
        await checkoutCompletePage.verifyCheckoutComplete();
    });

    it('should redirect to the inventory page', async() => {
        await checkoutCompletePage.backToInventory();
        expect(await checkoutCompletePage.inventoryDisplayed()).toBe(true);
    });

    it('should display remove button when cart is empty', async() => {
        await inventoryPage.openSidebar();
        await inventoryPage.addItemToCart();
        await inventoryPage.cartBadge.waitForDisplayed({ timeout: 2000 });
        await inventoryPage.resetAppState();

        expect(await inventoryPage.cartBadge.isExisting()).toBe(false);
        expect(await inventoryPage.removeButton.isDisplayed()).toBe(false);
    });
});
