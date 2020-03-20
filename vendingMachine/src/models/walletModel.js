import Observable from '../util/observable.js';
import URL from '../data/url.js';

class WalletModel extends Observable {
    constructor() {
        super();
        this.walletData = null;
        this.cash = new Map();
        this.cashTotal = 0;
        this.init();
    }

    init() {
        this.getData(URL.DEV.WALLET_API);
    }

    async getData(url) {
        const response = await fetch(url);
        this.walletData = await response.json();
        this.setCashInfo(this.walletData);
        this.notify('INIT_VENDING_MACHINE', this.walletData);
    }

    setCashInfo(data) {
        data.forEach(cashInfo => {
            this.cashTotal += (cashInfo.cashUnit * cashInfo.cashCount);
            this.cash.set(parseInt(cashInfo.cashUnit), cashInfo.cashCount);
        });
    }

    decreaseCashCount(cashUnit) {
        let curCount = this.cash.get(cashUnit);
        if (curCount <= 0) return;
        this.cash.set(cashUnit, --curCount);
        this.cashTotal -= cashUnit;
        this.notify('UPDATE_CASH_INFO', this.cash.get(cashUnit), this.cashTotal);
    }
}

export default WalletModel;