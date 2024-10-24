// Function to calculate and update the steel roofing quantity and related quantities
function updateSteelRoofingQty(width, length) {
    const steelRoofingQty = Math.floor(width * length * 1.2);
    document.getElementById('steelRoofingQty').value = steelRoofingQty.toFixed(2);

    calculateRow('steelRoofing'); // Update the "Qty x Rate" and "Total" fields

    // Update the 1x4x16 Roof Strapping quantity based on steel roofing quantity
    const framingQty = Math.floor((steelRoofingQty * 0.7) / 16);
    document.getElementById('roofStrappingQty').value = framingQty.toFixed(2);

    calculateRow('roofStrapping'); // Update the "Qty x Rate" and "Total" fields for Roof Strapping

    // Update the 4x8 S&F quantity based on the roof width
    const fourByEightSFQty = Math.floor((width * 1.2 * 2) / 8);
    document.getElementById('4x8SFQty').value = fourByEightSFQty.toFixed(2);

    calculateRow('4x8SF'); // Update the "Qty x Rate" and "Total" fields for 4x8 S&F

    // Update the 8x12 S&F quantity based on the roof length
    const eightByTwelveSFQty = Math.floor((length * 1.2 * 2) / 9.5);
    document.getElementById('8x12SFQty').value = eightByTwelveSFQty.toFixed(2);

    calculateRow('8x12SF'); // Update the "Qty x Rate" and "Total" fields for 8x12 S&F
}

// Function to calculate and update the shingle roofing quantity
function updateShingleRoofingQty(width, length) {
    const shingleRoofingQty = Math.floor((width * length * 1.2) / 30); // Calculate the shingles quantity
    document.getElementById('shinglesQty').value = shingleRoofingQty.toFixed(2);

    calculateRow('shingles'); // Update the "Qty x Rate" and "Total" fields

    // Calculate underlayment and plywood based on the total roof area
    const roofArea = Math.floor(width * length * 1.2); // Total roof area in square feet

    // Update underlayment quantity based on roof area
    document.getElementById('underlaymentQty').value = roofArea.toFixed(2);
    calculateRow('underlayment'); // Update the "Qty x Rate" and "Total" fields for underlayment

    // Update plywood quantity based on roof area
    document.getElementById('plywoodQty').value = roofArea.toFixed(2);
    calculateRow('plywood'); // Update the "Qty x Rate" and "Total" fields for plywood
}

// Function to clear quantities for the steel-related items
function clearSteelRoofingRelatedQuantities() {
    document.getElementById('steelRoofingQty').value = '';
    document.getElementById('roofStrappingQty').value = '';
    document.getElementById('4x8SFQty').value = '';
    document.getElementById('8x12SFQty').value = '';

    document.getElementById('steelRoofingQtyRate').innerText = '';
    document.getElementById('steelRoofingTotal').innerText = '';
    document.getElementById('roofStrappingQtyRate').innerText = '';
    document.getElementById('roofStrappingTotal').innerText = '';
    document.getElementById('4x8SFQtyRate').innerText = '';
    document.getElementById('4x8SFTotal').innerText = '';
    document.getElementById('8x12SFQtyRate').innerText = '';
    document.getElementById('8x12SFTotal').innerText = '';
}

// Function to clear quantities for the shingle-related items
function clearShingleRoofingRelatedQuantities() {
    document.getElementById('shinglesQty').value = '';
    document.getElementById('underlaymentQty').value = '';
    document.getElementById('plywoodQty').value = '';

    document.getElementById('shinglesQtyRate').innerText = '';
    document.getElementById('shinglesTotal').innerText = '';
    document.getElementById('underlaymentQtyRate').innerText = '';
    document.getElementById('underlaymentTotal').innerText = '';
    document.getElementById('plywoodQtyRate').innerText = '';
    document.getElementById('plywoodTotal').innerText = '';
}

// Function to update roofing materials based on user input
function updateRoofingMaterials() {
    const roofType = document.getElementById('roofType').value;
    const width = parseFloat(document.getElementById('roofWidth').value) || 0;
    const length = parseFloat(document.getElementById('roofLength').value) || 0;

    // Clear quantities and totals for both roof types before updating the selected one
    clearSteelRoofingRelatedQuantities();
    clearShingleRoofingRelatedQuantities();

    if (roofType === 'steel') {
        updateSteelRoofingQty(width, length);
    } else if (roofType === 'shingle') {
        updateShingleRoofingQty(width, length);
    }

    // Recalculate the overall totals
    updateTotalCosts();
}
