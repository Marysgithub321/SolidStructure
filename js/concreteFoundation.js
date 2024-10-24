// concreteFoundation.js

function updateConcreteFoundationQty() {
    const width = parseFloat(document.getElementById('foundationWidth').value) || 0;
    const length = parseFloat(document.getElementById('foundationLength').value) || 0;
    const concreteFoundationQty = (width + length) * 2.3;

    document.getElementById('concreteFoundationQty').value = concreteFoundationQty.toFixed(2);
    calculateRow('concreteFoundation'); // Assumes this function is imported or available globally
}
