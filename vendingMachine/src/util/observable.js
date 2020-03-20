class Observable {
    constructor() {
        this._observers = {
            'INIT_VENDING_MACHINE': new Set(),
            'UPDATE_CASH_INFO': new Set(),
            'SELECT_PRODUCT': new Set(),
            'PURCHASE_PRODUCT': new Set(),
            'CHANGE_CASH': new Set()
        };
    }

    subscribe(type, observer) {
        this._observers[type].add(observer);
    }

    unsubscribe(type, observer) {
        this._observers[type] = [...this._observers].filter(
            subscriber => subscriber !== observer
        );
    }

    notify(type, ...data) {
        this._observers[type].forEach(observer => observer(...data));
    }
}

export default Observable;