class ChangeModel {
    constructor(walletModel) {
        this.walletModel = walletModel;
        this.changeCash = 0;
        this.changeDelay = null;
        this.cashUnitInDescendingOrder = [...this.walletModel.cash.keys()].reverse();
    }

    addChange(insertedCash) {
        this.changeCash = insertedCash;
        this.walletModel.cashTotal += this.changeCash;

        this.cashUnitInDescendingOrder.forEach(cashUnit => {
            const cashCount = this.walletModel.cash.get(cashUnit);
            const cashUnitCount = parseInt(this.changeCash / cashUnit);
            if (!cashUnitCount) return;
            this.walletModel.cash.set(cashUnit, cashCount + cashUnitCount);
            this.changeCash %= cashUnit;
            this.walletModel.notify('CHANGE_CASH', cashUnit);
            this.walletModel.notify('UPDATE_CASH_INFO', cashCount + cashUnitCount, this.walletModel.cashTotal);
        });
    }
}

export default ChangeModel;