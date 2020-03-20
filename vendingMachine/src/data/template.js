export function productPanel(data) {
    const productList = data.reduce((list, product) => {
        list += `<li class='product'>
                    <span class='product-index product-info'>${product.index}</span>
                    <span class='product-emoji product-info'>${product.emoji}</span>
                    <span class='product-price product-info'>${product.price}</span>
                </li>`
        return list;
    }, '');
    return `<ul class='product-list'>${productList}</ul>`
}

export function productSelectPanel() {
    const productSelectBtns = [1, 2, 3, 4, 5, 6, 7, 8, 9, '취소', 0, '선택'].map(buttonType => {
        let className;
        switch (buttonType) {
            case '취소': className = 'reset-btn';
                break;
            case '선택': className = 'choice-btn';
                break;
            default: className = 'number-btn';
        };
        return `<button class='${className}' value='${buttonType}'>${buttonType}</button>`
    }).join('');

    return `
        <div class='product-select-info-wrap'>
            <div class='selected-product-index-wrap'>
                <span class='selected-product-index'>0</span>
            </div>

            <div class='inserted-cash-wrap'>
                <span class='inserted-cash'>0</span>
                <span class='cash-unit'>원</span>
            </div>
        </div>


        <div class='product-select-btns'>${productSelectBtns}</div>

        <ul class='product-select-log'></ul>
            `
}

export function walletPanel(data) {
    let cashTotal = 0;
    const walletList = data.reduce((list, cashInfo) => {
        cashTotal += (cashInfo.cashUnit * cashInfo.cashCount);
        list += `<li>
                    <button class='cash-btn' value='${cashInfo.cashUnit}'>${cashInfo.cashUnit}원</button>
                    <span class='cash-count'>${cashInfo.cashCount}</span>
                </li>`
        return list;
    }, '');
    return `<ul class='wallet-btns'>${walletList}</ul>
            <div class='wallet-cash-total-wrap'>
                <span class='wallet-cash-total'>${cashTotal}</span>
                <span>원</span>
            </div>
            `
}