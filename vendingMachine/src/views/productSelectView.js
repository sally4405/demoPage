import { getElement, getElements } from '../util/domUtil.js';
import { productSelectPanel } from '../data/template.js';

class ProductSelectView {
    constructor(vendingMachineModel) {
        this.render();
        this.insertedCash = getElement('.inserted-cash');
        this.productSelectLog = getElement('.product-select-log');
        this.vendingMachineModel = vendingMachineModel;
        this.vendingMachineModel.subscribe('UPDATE_CASH_INFO', this.updateInsertedCash.bind(this));
        this.vendingMachineModel.subscribe('SELECT_PRODUCT', this.updateSelectIndex.bind(this));
        this.vendingMachineModel.subscribe('PURCHASE_PRODUCT', this.updateSelectProduct.bind(this));
        this.vendingMachineModel.subscribe('CHANGE_CASH', this.updateChangeCash.bind(this));
    }

    render() {
        const productSelectWrap = getElement('.product-select-wrap');
        productSelectWrap.innerHTML = productSelectPanel();

        const productSelectBtns = getElements('.number-btn');
        productSelectBtns.forEach(numberBtn => {
            numberBtn.addEventListener('click', this.productSelectBtnsHandler.bind(this));
        });

        const resetBtn = getElement('.reset-btn');
        resetBtn.addEventListener('click', this.resetBtnHandler.bind(this));

        const choiceBtn = getElement('.choice-btn');
        choiceBtn.addEventListener('click', this.choiceBtnHandler.bind(this));
    }

    productSelectBtnsHandler({ target }) {
        const selectedIndex = target.value;
        this.vendingMachineModel.addSelectedProductIndex(selectedIndex);
    }

    resetBtnHandler() {
        this.vendingMachineModel.selectResetBtn();
    }

    choiceBtnHandler() {
        this.vendingMachineModel.selectChoiceBtn();
    }

    makeLog(log) {
        const logElement = document.createElement('li');
        logElement.innerHTML = log;
        return logElement;
    }

    updateInsertedCash({ bLogUpdate = true, insertedCash, cash }) {
        if (!bLogUpdate) return;
        this.insertedCash.innerHTML = insertedCash;
        this.productSelectLog.appendChild(this.makeLog(`${cash}원 투입 되었습니다.`));
        this.productSelectLog.scrollTop = this.productSelectLog.scrollHeight;
    }

    updateSelectIndex(index) {
        this.selectedProductIndex = getElement('.selected-product-index');
        this.selectedProductIndex.innerHTML = parseInt(index);
    }

    updateSelectProduct({ bCashNotEnough = false, insertedCash, product }) {
        if (bCashNotEnough) this.productSelectLog.appendChild(this.makeLog(`<span style="color: #994545">잔액이 부족 합니다.</span>`));
        else {
            this.insertedCash.innerHTML = insertedCash;
            this.productSelectLog.appendChild(this.makeLog(`　${product.emoji} ${product.name}　덜컹 ~`));

            clearTimeout(this.vendingMachineModel.changeModel.changeDelay);
            this.vendingMachineModel.changeModel.changeDelay = setTimeout(this.vendingMachineModel.notifyAddChange.bind(this.vendingMachineModel), 5000);
        }
        this.productSelectLog.scrollTop = this.productSelectLog.scrollHeight;
    }

    updateChangeCash(changeCash, insertedCash = 0) {
        this.insertedCash.innerHTML = insertedCash;
        this.productSelectLog.appendChild(this.makeLog(`${changeCash}원 반환 되었습니다.`));
        this.productSelectLog.scrollTop = this.productSelectLog.scrollHeight;
    }
}

export default ProductSelectView;