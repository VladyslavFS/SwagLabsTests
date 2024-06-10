const LoginPage = require('../pageobjects/LoginPage');
const InventoryPage = require('../pageobjects/InventoryPage');
const CartPage = require('../pageobjects/CartPage');
const CheckoutPage = require('../pageobjects/CheckoutPage');
const CheckoutCompletePage = require('../pageobjects/CheckoutCompletePage');

describe('My WebdriverIO Test', () => {
    let productPrice;

    before(async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');
        await InventoryPage.open();
    });

    it('should add product to cart and complete the checkout process', async () => {
        await InventoryPage.addItemToCart();
        expect(await InventoryPage.cartBadge.getText()).toBe('1');
        productPrice = await InventoryPage.getProductPrice();
    });

    it('should display cart page with product from step 1', async() => {
        await InventoryPage.goToCart();
        await CartPage.waitForPage();
        expect(await CartPage.item.isDisplayed()).toBe(true);
    });

    it('should display checkout form', async() => {
        await CartPage.proceedToCheckout();
        await CheckoutPage.waitForPage();
        expect(await CheckoutPage.checkoutContainer.isDisplayed()).toBe(true);
    });

    it('should input first name', async() => {
        await CheckoutPage.fillCheckoutForm('Vladyslav', '', '');
        expect(await CheckoutPage.inputFirstName.getAttribute('value')).toBe('Vladyslav');
    });

    it('should input last name', async() => {
        await CheckoutPage.fillCheckoutForm('', 'Fushtor', '');
        expect(await CheckoutPage.inputLastName.getAttribute('value')).toBe('Fushtor');
    });

    it('should input postal code', async() => {
        await CheckoutPage.fillCheckoutForm('', '', '46000');
        expect(await CheckoutPage.inputPostalCode.getAttribute('value')).toBe('46000');
    });

    it('should redirect to the "Overview" page and display items from step 1', async() => {
        await CheckoutPage.continueToOverview();
        const checkoutOverviewTitle = await $('div.header_secondary_container span.title');
        const subtotalElement = await $('.summary_subtotal_label');
        const subtotalText = await subtotalElement.getText();
        const parts = subtotalText.split(':');
        const priceText = parts[1].trim();

        expect(await checkoutOverviewTitle.isDisplayed()).toBe(true);
        expect(await CartPage.item.isDisplayed()).toBe(true);
        expect(await priceText).toBe(productPrice);
    });

    it('should redirect to the "Checkout Complete" page', async() => {
        await CheckoutCompletePage.finishCheckout();
        await CheckoutCompletePage.verifyCheckoutComplete();
    });

    it('should redirect to the inventory page', async() => {
        await CheckoutCompletePage.backToInventory();
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

        await InventoryPage.addItemToCart();
        await InventoryPage.cartBadge.waitForDisplayed({ timeout: 2000 });

        await InventoryPage.resetAppState();

        if (!(await InventoryPage.cartBadge.isExisting())) {
            expect(await InventoryPage.removeButton.isDisplayed()).toBe(true);
        } else {
            console.log('Test failed');
        }
    });
});
