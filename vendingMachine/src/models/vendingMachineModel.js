import Observable from '../util/observable.js';
import URL from '../data/url.js';

const DEFAULT = {
    PRODUCT_INDEX: '0'
}

class VendingMachineModel extends Observable {
    constructor(changeModel) {
        super();
        this.productData = null;
        this.insertedCash = 0;
        this.selectedProductIndex = DEFAULT.PRODUCT_INDEX;
        this.changeModel = changeModel;
        this.init();
    }

    init() {
        this.getData(URL.DEV.PRODUCT_API);
    }

    async getData(url) {
        const response = await fetch(url);
        this.productData = await response.json();
        this.notify('INIT_VENDING_MACHINE', this.productData);
    }

    sumInsertedCash(cashUnit, cashCount) {
        if (cashCount === 0) return;
        this.insertedCash += cashUnit;
        this.notify('UPDATE_CASH_INFO', { insertedCash: this.insertedCash, cash: cashUnit });
    }

    addSelectedProductIndex(selectedIndex) {
        if (this.selectedProductIndex + selectedIndex > this.productData.length) return;
        this.selectedProductIndex += selectedIndex;
        this.notify('SELECT_PRODUCT', this.selectedProductIndex);
    }

    selectResetBtn() {
        this.selectedProductIndex = DEFAULT.PRODUCT_INDEX;
        this.notify('SELECT_PRODUCT', this.selectedProductIndex);
    }

    selectChoiceBtn() {
        if (this.selectedProductIndex === DEFAULT.PRODUCT_INDEX) return;
        this.notifySelectedProduct();
    }

    selectProduct(selectedProductIndex) {
        this.selectedProductIndex = selectedProductIndex;
        this.notifySelectedProduct();
    }

    getProductInfo() {
        return {
            emoji: this.productData[parseInt(this.selectedProductIndex) - 1].emoji,
            name: this.productData[parseInt(this.selectedProductIndex) - 1].name,
            price: this.productData[parseInt(this.selectedProductIndex) - 1].price
        }
    }

    notifySelectedProduct() {
        if (parseInt(this.selectedProductIndex) === 0) return;
        const productInfo = this.getProductInfo();
        this.selectedProductIndex = DEFAULT.PRODUCT_INDEX;
        this.notify('SELECT_PRODUCT', this.selectedProductIndex);
        this.purchase(productInfo);
    }

    purchase(productInfo) {
        if (productInfo.price > this.insertedCash) {
            this.notify('PURCHASE_PRODUCT', { bCashNotEnough: true });
            return;
        }
        this.insertedCash -= productInfo.price;
        this.notify('PURCHASE_PRODUCT', { insertedCash: this.insertedCash, product: { emoji: productInfo.emoji, name: productInfo.name }, index: this.selectedProductIndex });
        this.notify('UPDATE_CASH_INFO', { bLogUpdate: false });
    }

    notifyAddChange() {
        if (!this.insertedCash) return;
        this.changeModel.addChange(this.insertedCash);
        this.notify('CHANGE_CASH', this.insertedCash);
        this.insertedCash = 0;
        this.notify('UPDATE_CASH_INFO', { bLogUpdate: false });
    }
}

export default VendingMachineModel;