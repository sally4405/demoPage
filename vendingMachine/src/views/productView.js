import { getElement, getElements, classAdd, classRemove } from '../util/domUtil.js';
import { productPanel } from '../data/template.js';

class ProductView {
    constructor(vendingMachineModel) {
        this.vendingMachineModel = vendingMachineModel;
        this.vendingMachineModel.subscribe('UPDATE_CASH_INFO', this.updateProductHighlight.bind(this));
        this.vendingMachineModel.subscribe('INIT_VENDING_MACHINE', this.render.bind(this));
    }

    render(data) {
        const productWrap = getElement('.product-wrap');
        productWrap.innerHTML = productPanel(data);

        const productList = getElement('.product-list');
        productList.addEventListener('click', this.productListHandler.bind(this));
    }

    productListHandler({ target }) {
        if (target.classList.contains('product-info')) target = target.closest('.product');
        if (!target.classList.contains('product')) return;
        const selectedProductIndex = parseInt(target.querySelector('.product-index').innerText);
        this.vendingMachineModel.selectProduct(selectedProductIndex);
    }

    updateProductHighlight() {
        const productPrice = getElements('.product-price');
        Array.from(productPrice).forEach(priceNode => {
            if (parseInt(priceNode.innerText) <= this.vendingMachineModel.insertedCash) classAdd(priceNode.parentElement, 'on');
            else if (priceNode.parentElement.classList.contains('on')) classRemove(priceNode.parentElement, 'on');
        });
    }
}

export default ProductView;