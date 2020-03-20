import { getElement } from '../util/domUtil.js';
import { walletPanel } from '../util/template.js';

class WalletView {
    constructor(walletModel, vendingMachineModel) {
        this.walletModel = walletModel;
        this.vendingMachineModel = vendingMachineModel;
        this.walletModel.subscribe('UPDATE_CASH_INFO', this.cashInfoUpdate.bind(this));
        this.walletModel.subscribe('CHANGE_CASH', this.searchCashCountEl.bind(this));
        this.walletModel.subscribe('INIT', this.render.bind(this));
        this.cashCountEl = null;
    }

    render(data) {
        const walletWrap = getElement('.wallet-wrap');
        walletWrap.innerHTML = walletPanel(data);

        const walletBtns = getElement('.wallet-btns');
        walletBtns.addEventListener('click', this.walletBtnsHandler.bind(this));
    }

    walletBtnsHandler({ target }) {
        if (!target.classList.contains('cash-btn')) return;
        const cashUnit = parseInt(target.value);
        this.cashCountEl = target.nextElementSibling;
        this.vendingMachineModel.sumInsertedCash(cashUnit, parseInt(this.cashCountEl.innerText));
        this.walletModel.decreaseCashCount(cashUnit);

        clearTimeout(this.vendingMachineModel.changeModel.changeDelay);
        this.vendingMachineModel.changeModel.changeDelay = setTimeout(this.vendingMachineModel.notifyAddChange.bind(this.vendingMachineModel), 5000);
    }

    cashInfoUpdate(cashCount, cashTotal) {
        this.total = getElement('.wallet-cash-total');
        this.cashCountEl.innerHTML = cashCount;
        this.total.innerHTML = cashTotal;
    }

    searchCashCountEl(cashUnit) {
        this.cashCountEl = getElement(`button[value="${cashUnit}"]`).nextElementSibling;
    }
}

export default WalletView;