// prices.js

const defaultPrices = {
    poleFoundationPrice: 0,
    concreteFoundationPrice: 65,
    "2x4x10Price": 4,
    "2x4x16Price": 6.75,
    "2x4x8Price": 3.25,
    "2x6x10Price": 18.70,
    "2x6x12Price": 14.40,
    "2x6x14Price": 16.00,
    "2x6x16Price": 25.75,
    "plates2x6x16Price": 25.75,
    "1x4x16Price": 15.00,
    "2x8HeaderPrice": 14.50,
    "2x10x8HeaderPrice": 18.00,
    "2x10x10HeaderPrice": 40.00,
    "2x10x10WindowHeaderPrice": 40.00,
    "2x10x12HeaderPrice": 28.00,
    "2x12x14LVLHeaderPrice": 200.00,
    "2x12x16LVLHeaderPrice": 500.00,
    "2x14x18LVLHeaderPrice": 700,
    "LVLHeaderPrice": 99.00,
    "2x8x16Price": 800.00,
    sqfWallsPrice: 1.80,
    wValleyPrice: 22.00,
    "8x12SFPrice": 50.00,
    "4x8SFPrice": 46.30,
    "9doorJamPrice": 22.00,
    jPrice: 11.88,
    manDoorJPrice: 11.88,
    dripEdgePrice: 12.00,
    manDoorDripEdgePrice: 12.00,
    gableDividerPrice: 11.88,
    ratGuardPrice: 11.70,
    cornerWithJPrice: 25.00,
    cornerBoxPrice: 65.00,
    ridgeBoxPrice: 20.00,
    ridgeCapPrice: 20.00,
    reRoofEavePrice: 0,
    reRoofGablePrice: 0,
    eaveStarterPrice: 0,
    gableStarterPrice: 0,
    sideWallFlashingPrice: 25.00,
    endWallFlashingPrice: 0,
    garageDoorsPrice: 100.00,
    specialtyGarageDoorsPrice: 0,
    specialtyWindowsPrice: 0,
    windowsPrice: 275.00,
    manDoorsPrice: 550.00,
    trussesPrice: 0,
    steelRoofingPrice: 1.80,
    roofStrappingPrice: 15.00,
    shinglesPrice: 34.00,
    plywoodPrice: 4.00,
    underlaymentPrice: 1.50,
    "4InchConcretePrice": 4.50,
    "5InchConcretePrice": 4.30,
    "6InchConcretePrice": 4.85,
    inFloorHeatPrice: 0,
    excavationPrice: 0,
    electricalPrice: 0,
};

document.addEventListener('DOMContentLoaded', () => {
    initializePrices();

    document.getElementById('updatePricesButton').addEventListener('click', updatePrices);
});

// Initialize prices from localStorage or default if not available
function initializePrices() {
    const storedPrices = JSON.parse(localStorage.getItem('materialPrices')) || defaultPrices;
    for (const [key, value] of Object.entries(storedPrices)) {
        const element = document.getElementById(key);
        if (element) {
            element.value = value;
        }
    }
    updateGridRates(storedPrices);
    resetQuantitiesAndTotals();
}

// Update the grid rates based on the stored prices
function updateGridRates(prices) {
    for (const [key, value] of Object.entries(prices)) {
        const rateElementId = key.replace('Price', 'Rate');
        const rateElement = document.getElementById(rateElementId);
        if (rateElement) {
            rateElement.value = value;
        }
    }
}

// Event listener for DOMContentLoaded to initialize prices and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializePrices();
    document.getElementById('updatePricesButton').addEventListener('click', updatePrices);
});

// Function to update prices and save to localStorage
function updatePrices() {
    const prices = {};
    for (const key in defaultPrices) {
        const element = document.getElementById(key);
        if (element) {
            prices[key] = parseFloat(element.value) || 0;
        }
    }
    localStorage.setItem('materialPrices', JSON.stringify(prices));
    updateGridRates(prices);
    alert('Prices updated successfully!');
}

// Function to reset quantities and totals
function resetQuantitiesAndTotals() {
    document.querySelectorAll('.grid-input').forEach(input => {
        if (input.id.includes('Qty')) {
            input.value = 0;
        }
    });

    document.querySelectorAll('[id$="QtyRate"], [id$="Total"]').forEach(div => {
        div.innerText = '0';
    });

    updateTotalCosts();
}
