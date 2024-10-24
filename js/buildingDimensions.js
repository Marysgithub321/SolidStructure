
// Function to update the building-related materials when dimensions are entered
function updateBuildingMaterials() {
    const height = parseFloat(document.getElementById('buildingHeight').value) || 0;
    const width = parseFloat(document.getElementById('buildingWidth').value) || 0;
    const length = parseFloat(document.getElementById('buildingLength').value) || 0;

    // Ensure dimensions are entered
    if (height > 0 && width > 0 && length > 0) {
        // Update material quantities for corner boxes and ridge boxes
        const cornerBoxQtyElement = document.getElementById('cornerBoxQty');
        const ridgeBoxQtyElement = document.getElementById('ridgeBoxQty');

        if (cornerBoxQtyElement && ridgeBoxQtyElement) {
            // Check if the corner and ridge boxes are already added
            if (parseInt(cornerBoxQtyElement.value) === 0 && parseInt(ridgeBoxQtyElement.value) === 0) {
                cornerBoxQtyElement.value = 4;
                ridgeBoxQtyElement.value = 2;

                // Update the related rows in the material list
                calculateSteelRow('cornerBox'); // Assuming 'cornerBox' is the row ID
                calculateSteelRow('ridgeBox'); // Assuming 'ridgeBox' is the row ID

                updateTotalCosts(); // Recalculate total costs
            }
        }
    } else {
        // If dimensions are not valid, clear the corner and ridge box quantities
        clearBuildingMaterials();
    }
}

// Function to clear the building-related materials if dimensions are removed
function clearBuildingMaterials() {
    const cornerBoxQtyElement = document.getElementById('cornerBoxQty');
    const ridgeBoxQtyElement = document.getElementById('ridgeBoxQty');

    if (cornerBoxQtyElement && ridgeBoxQtyElement) {
        cornerBoxQtyElement.value = 0;
        ridgeBoxQtyElement.value = 0;

        calculateSteelRow('cornerBox');
        calculateSteelRow('ridgeBox');

        updateTotalCosts();
    }
}


function updateCornerWithJMaterials() {
    // Parse the building height from the input, defaulting to 0 if it's not a valid number
    const buildingHeight = parseFloat(document.getElementById('buildingHeight').value) || 0;

    let numCornerWithJ = 0; // Initialize the count for "Corner with J"

    // Determine the number of corners with J based on the building height
    if (buildingHeight === 8 || buildingHeight === 9 || buildingHeight === 10) {
        numCornerWithJ = 4; // For heights 8, 9, or 10, use 4 corners with J
    } else if (buildingHeight === 12 || buildingHeight === 14) {
        numCornerWithJ = 6; // For heights 12 or 14, use 6 corners with J
    } else if (buildingHeight === 16) {
        numCornerWithJ = 8; // For height 16, use 8 corners with J
    }

    // Select the input element for "Corner with J" quantity
    const cornerWithJQtyElement = document.getElementById('cornerWithJQty');
    
    // Ensure the element exists before updating
    if (cornerWithJQtyElement) {
        // Update the value for the "Corner with J" quantity input
        cornerWithJQtyElement.value = numCornerWithJ;

        // Trigger recalculation of the row to update totals
        calculateSteelRow('cornerWithJ'); // Ensure this function is imported or available globally

        // Recalculate the overall total costs
        updateTotalCosts();
    } else {
        // Log an error if the element with ID 'cornerWithJQty' is not found
        console.error('Element with ID "cornerWithJQty" not found.');
    }
}



function updateRidgeCapQty() {
    // Get the length of the building
    const length = parseFloat(document.getElementById('buildingLength').value) || 0;

    // Calculate the Ridge Cap quantity
    const ridgeCapQty = Math.floor((length * 1.25) / 10);

    // Update the Ridge Cap quantity in the material list
    document.getElementById('ridgeCapQty').value = ridgeCapQty;

    // Recalculate the row to update totals
    calculateSteelRow('ridgeCap'); // Assuming 'ridgeCap' is the correct row ID
}

function updateWallSQFQty() {
    // Get the height, width, and length of the building
    const height = parseFloat(document.getElementById('buildingHeight').value) || 0;
    const width = parseFloat(document.getElementById('buildingWidth').value) || 0;
    const length = parseFloat(document.getElementById('buildingLength').value) || 0;

    // Calculate the SQF for the width and length walls
    const widthWallSQF = height * width * 2.3;
    const lengthWallSQF = height * length * 2.3;

    // Add the SQF of the width and length walls to get the total SQF of walls
    const totalWallSQF = widthWallSQF + lengthWallSQF;

    // Update the SQF of walls quantity in the material list
    document.getElementById('sqfWallsQty').value = totalWallSQF.toFixed(2);

    // Recalculate the row to update totals
    calculateSteelRow('sqfWalls'); // 'sqfWalls' should match the row ID you want to calculate
}

function updateRatGuardQty() {
    // Get the width and length of the building
    const width = parseFloat(document.getElementById('buildingWidth').value) || 0;
    const length = parseFloat(document.getElementById('buildingLength').value) || 0;

    // Calculate the Rat guard quantity
    const perimeter = (width + length) * 2.3;
    const ratGuardQty = Math.floor(perimeter / 9.5);

    // Update the Rat guard quantity in the material list
    document.getElementById('ratGuardQty').value = ratGuardQty;

    // Recalculate the row to update totals
    calculateSteelRow('ratGuard'); // Assuming 'ratGuard' is the correct row ID
}

function updateGableDividerQty() {
    // Get the width of the building
    const width = parseFloat(document.getElementById('buildingWidth').value) || 0;

    // Calculate the Gable Divider quantity
    const gableDividerQty = Math.floor((width * 2.5) / 10);

    // Update the Gable Divider quantity in the material list
    document.getElementById('gableDividerQty').value = gableDividerQty;

    // Recalculate the row to update totals
    calculateSteelRow('gableDivider'); // Assuming 'gableDivider' is the correct row ID
}


// Function to update plates 2x6x16 quantity
function updateplates2x6x16Qty() {
    // Get the width and length of the building
    const width = parseFloat(document.getElementById('buildingWidth').value) || 0;
    const length = parseFloat(document.getElementById('buildingLength').value) || 0;

    // Calculate the Plates 2x6x16 quantity
    const totalLength = (width + length) * 2.3;  // Include the 2.3 multiplier
    const plates2x6x16Qty = Math.floor((totalLength * 4) / 16);

    // Update the Plates 2x6x16 quantity in the material list
    const qtyInput = document.getElementById('plates2x6x16Qty');
    
    if (qtyInput) {
        qtyInput.value = plates2x6x16Qty;

        // Trigger any change listeners or functions that depend on this value
        calculateFramingRow('plates2x6x16');
    } else {
        console.error('Input element with id plates2x6x16Qty not found!');
    }
}

function updateFramingMaterials() {
    // Get the height, width, and length of the building
    const height = parseFloat(document.getElementById('buildingHeight').value) || 0;
    const width = parseFloat(document.getElementById('buildingWidth').value) || 0;
    const length = parseFloat(document.getElementById('buildingLength').value) || 0;

    // Determine the wood type based on the height
    let woodType = '';
    if (height === 8 || height === 9 || height === 10) {
        woodType = '2x6x10';
    } else if (height === 12) {
        woodType = '2x6x12';
    } else if (height === 14) {
        woodType = '2x6x14';
    } else if (height === 16) {
        woodType = '2x6x16';
    }

    // Calculate the total length to determine the quantity of wood needed
    const totalLength = (width + length) * 2.3;
    const woodQty = (totalLength * 0.75).toFixed(2); // Keep two decimal places

    // Reset all wood quantities and related fields to 0 before setting the correct one
    const woodTypes = ['2x6x10', '2x6x12', '2x6x14', '2x6x16'];
    woodTypes.forEach(type => {
        const qtyInput = document.getElementById(`${type}Qty`);
        const qtyRate = document.getElementById(`${type}QtyRate`);
        const total = document.getElementById(`${type}Total`);

        if (qtyInput) {
            qtyInput.value = 0; // Reset quantity to 0
        }

        if (qtyRate) {
            qtyRate.textContent = '0'; // Reset Qty x Rate to 0
        }

        if (total) {
            total.textContent = '0'; // Reset Total to 0
        }
    });

    // Update the quantity in the material list for the correct wood type
    if (woodType) {
        const qtyInput = document.getElementById(`${woodType}Qty`);
        if (qtyInput) {
            qtyInput.value = woodQty; // Set the correct quantity
            calculateFramingRow(woodType); // Recalculate the row to update totals
        }
    }

    // Update plates 2x6x16 quantity based on building dimensions
    updateplates2x6x16Qty();

    // Function to update 1x4x16 quantity based on building dimensions
    let multiplier = 5.1; // Default multiplier for 8ft building height

    // Adjust the multiplier based on the height
    if (height === 9 || height === 10) {
        multiplier = 6.1;
    } else if (height === 12) {
        multiplier = 7.1;
    } else if (height === 14) {
        multiplier = 8.1;
    } else if (height === 16) {
        multiplier = 9.1;
    }

    const perimeter = (width + length) * 2.3;
    const result = Math.floor((perimeter * multiplier) / 16);

    document.getElementById('1x4x16Qty').value = result;
    calculateFramingRow('1x4x16'); // Update the related fields
}
