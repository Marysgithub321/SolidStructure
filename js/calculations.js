// calculations.js



// Function to calculate row totals with a dynamic markup value
function calculateRow(rowId) {
    const qty = parseFloat(document.getElementById(`${rowId}Qty`).value) || 0;
    const rate = parseFloat(document.getElementById(`${rowId}Rate`).value) || 0;
    const markup = parseFloat(document.getElementById(`${rowId}Markup`).value) || 1; // Dynamic markup value, default to 1

    const qtyRate = qty * rate;
    const total = qtyRate * markup;

    document.getElementById(`${rowId}QtyRate`).innerText = qtyRate.toFixed(2);
    document.getElementById(`${rowId}Total`).innerText = total.toFixed(2);

    updateTotalCosts(); // Update total costs whenever a row is recalculated
}

// Wrapper functions for clarity and usage in other scripts
const calculateFramingRow = calculateRow;
const calculateSteelRow = calculateRow;
const calculateFloorRow = calculateRow;
const calculateRoofRow = calculateRow;

// Function to update the total costs
function updateTotalCosts() {
    const allTotalElements = document.querySelectorAll('[id$="Total"]');
    let subtotal = 0;

    allTotalElements.forEach(totalElement => {
        const total = parseFloat(totalElement.innerText) || 0;
        subtotal += total;
    });

    const taxAmount = subtotal * 0.13; // Assuming a tax rate of 13%
    const totalAll = subtotal + taxAmount;

    document.getElementById('subTotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').innerText = `$${taxAmount.toFixed(2)}`;
    document.getElementById('totalAll').innerText = `$${totalAll.toFixed(2)}`;
}

