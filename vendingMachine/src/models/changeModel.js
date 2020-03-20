class ChangeModel {
    constructor(walletModel) {
        this.walletModel = walletModel;
        this.changeCash = 0;
        this.changeDelay = null;
    }

    addChange(insertedCash) {
        this.changeCash = insertedCash;
        this.walletModel.cashTotal += this.changeCash;

        [...this.walletModel.cash.keys()].reverse().forEach(cashUnit => {
            const cashCount = this.walletModel.cash.get(cashUnit);
            const cashUnitCount = parseInt(this.changeCash / cashUnit);
            this.walletModel.cash.set(cashUnit, cashCount + cashUnitCount);
            this.changeCash %= cashUnit;
            if (!cashUnitCount) return;
            this.walletModel.notify('CHANGE_CASH', cashUnit);
            this.walletModel.notify('UPDATE_CASH_INFO', cashCount + cashUnitCount, this.walletModel.cashTotal);
        });
    }
}

export default ChangeModel;