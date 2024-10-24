let garageDoors = [];
let garageDoorSectionCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addGarageDoorButton').addEventListener('click', addGarageDoor);
});

function addGarageDoor() {
    garageDoorSectionCount++;
    const newGarageDoorSection = document.createElement('div');
    newGarageDoorSection.classList.add('garage-door-section');
    newGarageDoorSection.id = `garage-door-section-${garageDoorSectionCount}`;

    newGarageDoorSection.innerHTML = `
        <label for="doorSizes-${garageDoorSectionCount}">Select Door Size:</label>
        <select id="doorSizes-${garageDoorSectionCount}" name="doorSizes">
            <option value="" disabled selected>Select a door size</option>
            <option value="8x8">8x8</option>
            <option value="8x10">8x10</option>
            <option value="8x12">8x12</option>
            <option value="8x14">8x14</option>
            <option value="10x8">10x8</option>
            <option value="10x10">10x10</option>
            <option value="10x12">10x12</option>
            <option value="10x14">10x14</option>
            <option value="12x8">12x8</option>
            <option value="12x10">12x10</option>
            <option value="12x12">12x12</option>
            <option value="12x14">12x14</option>
            <option value="14x8">14x8</option>
            <option value="14x10">14x10</option>
            <option value="14x12">14x12</option>
            <option value="14x14">14x14</option>
            <option value="16x8">16x8</option>
            <option value="16x10">16x10</option>
            <option value="16x12">16x12</option>
            <option value="16x14">16x14</option>
        </select>
        <label for="doorQuantity-${garageDoorSectionCount}">Quantity:</label>
        <input type="number" id="doorQuantity-${garageDoorSectionCount}" name="doorQuantity" min="1" value="" disabled />
        <label for="garageDoorDescription-${garageDoorSectionCount}">Description:</label>
        <input type="text" id="garageDoorDescription-${garageDoorSectionCount}" class="navigable" maxlength="60" disabled />
        <button type="button" onclick="removeGarageDoor(${garageDoorSectionCount})">Remove Door</button>
    `;

    document.getElementById('garageDoors').appendChild(newGarageDoorSection);

    // Set up event listeners
    attachEventListeners(garageDoorSectionCount);
}

function attachEventListeners(sectionId) {
    const doorSizeElement = document.getElementById(`doorSizes-${sectionId}`);
    const doorQuantityElement = document.getElementById(`doorQuantity-${sectionId}`);
    const doorDescriptionElement = document.getElementById(`garageDoorDescription-${sectionId}`);

    // Enable quantity and description fields once the size is selected
    doorSizeElement.addEventListener('change', () => {
        doorQuantityElement.disabled = false;
        doorDescriptionElement.disabled = false;
        updateGarageDoor(sectionId);
    });

    // Update the materials when the quantity is entered
    doorQuantityElement.addEventListener('input', () => {
        updateGarageDoor(sectionId);
    });
}

function updateGarageDoor(sectionId) {
    const selectedDoorSize = document.getElementById(`doorSizes-${sectionId}`).value;
    const doorQuantity = parseInt(document.getElementById(`doorQuantity-${sectionId}`).value) || 0;

    // Find the door in the array or add it
    const doorIndex = garageDoors.findIndex(door => door.id === sectionId);
    if (doorIndex !== -1) {
        garageDoors[doorIndex].size = selectedDoorSize;
        garageDoors[doorIndex].quantity = doorQuantity;
    } else {
        garageDoors.push({ id: sectionId, size: selectedDoorSize, quantity: doorQuantity });
    }

    // Only recalculate materials if both a size and quantity are selected
    if (selectedDoorSize && doorQuantity > 0) {
        recalculateGarageDoorMaterials();
    }
}

function removeGarageDoor(sectionId) {
    // Find the door being removed
    const door = garageDoors.find(door => door.id === sectionId);
    if (door) {
        // Subtract materials associated with this door before removing it
        subtractMaterialsForDoor(door);

        // Remove the door from the array
        garageDoors = garageDoors.filter(door => door.id !== sectionId);
    }

    // Remove the section from the DOM
    document.getElementById(`garage-door-section-${sectionId}`).remove();

    // Recalculate materials for the remaining garage doors
    recalculateGarageDoorMaterials();
}

// Function to subtract materials when a door is removed
function subtractMaterialsForDoor(door) {
    const doorData = doorSizeData[door.size];
    if (!doorData) return;

    // Subtract the materials associated with the removed door
    document.getElementById('dripEdgeQty').value = Math.max(0, (parseInt(document.getElementById('dripEdgeQty').value) || 0) - doorData.dripEdgeQty * door.quantity);
    document.getElementById('jQty').value = Math.max(0, (parseInt(document.getElementById('jQty').value) || 0) - doorData.jsQty * door.quantity);
    document.getElementById('9doorJamQty').value = Math.max(0, (parseInt(document.getElementById('9doorJamQty').value) || 0) - doorData.doorJamsQty * door.quantity);

    const headerQtyElement = document.getElementById(`${doorData.headersType}Qty`);
    if (headerQtyElement) {
        headerQtyElement.value = Math.max(0, (parseInt(headerQtyElement.value) || 0) - doorData.headersQty * door.quantity);
        calculateFramingRow(doorData.headersType); // Recalculate total for the header
    }

    calculateSteelRow('dripEdge');
    calculateSteelRow('j');
    calculateSteelRow('9doorJam');
    updateTotalCosts();
}

function recalculateGarageDoorMaterials() {
    let totalDripEdgeQty = 0;
    let totalJQty = 0;
    let totalDoorJamQty = 0;
    let totalGarageDoorsQty = 0;
    let totalHeadersQty = {}; // Track header quantities for each header type

    // Recalculate based on garage doors
    garageDoors.forEach(door => {
        const doorData = doorSizeData[door.size];
        if (!doorData) return;

        totalDripEdgeQty += doorData.dripEdgeQty * door.quantity;
        totalJQty += doorData.jsQty * door.quantity;
        totalDoorJamQty += doorData.doorJamsQty * door.quantity;
        totalGarageDoorsQty += door.quantity;

        if (!totalHeadersQty[doorData.headersType]) {
            totalHeadersQty[doorData.headersType] = 0;
        }
        totalHeadersQty[doorData.headersType] += doorData.headersQty * door.quantity;
    });

    // Update the material quantities in the DOM
    document.getElementById('dripEdgeQty').value = totalDripEdgeQty;
    document.getElementById('jQty').value = totalJQty;
    document.getElementById('9doorJamQty').value = totalDoorJamQty;
    document.getElementById('garageDoorsQty').value = totalGarageDoorsQty;

    // Update header quantities in the material list
    for (const headerType in totalHeadersQty) {
        const headerQtyElement = document.getElementById(`${headerType}Qty`);
        if (headerQtyElement) {
            headerQtyElement.value = totalHeadersQty[headerType];
            calculateFramingRow(headerType); // Recalculate total for each header type
        }
    }

    calculateSteelRow('dripEdge');
    calculateSteelRow('j');
    calculateSteelRow('9doorJam');
    calculateSteelRow('garageDoors'); // Ensure garageDoors material row is updated
    updateTotalCosts();
}

// Define the door size data once
const doorSizeData = {
    "8x8": { headersQty: 2, headersType: "2x10x10Header", doorJamsQty: 3, jsQty: 3, dripEdgeQty: 1 },
    "8x10": { headersQty: 2, headersType: "2x10x10Header", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 1 },
    "8x12": { headersQty: 2, headersType: "2x10x10Header", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 1 },
    "8x14": { headersQty: 2, headersType: "2x10x10Header", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 1 },
    "10x8": { headersQty: 2, headersType: "2x10x12Header", doorJamsQty: 3, jsQty: 3, dripEdgeQty: 2 },
    "10x10": { headersQty: 2, headersType: "2x10x12Header", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "10x12": { headersQty: 2, headersType: "2x10x12Header", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "10x14": { headersQty: 2, headersType: "2x10x12Header", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "12x8": { headersQty: 2, headersType: "2x12x14LVLHeader", doorJamsQty: 3, jsQty: 3, dripEdgeQty: 2 },
    "12x10": { headersQty: 2, headersType: "2x12x14LVLHeader", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "12x12": { headersQty: 2, headersType: "2x12x14LVLHeader", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "12x14": { headersQty: 2, headersType: "2x12x14LVLHeader", doorJamsQty: 5, jsQty: 5, dripEdgeQty: 2 },
    "14x8": { headersQty: 2, headersType: "2x12x16LVLHeader", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "14x10": { headersQty: 2, headersType: "2x12x16LVLHeader", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "14x12": { headersQty: 2, headersType: "2x12x16LVLHeader", doorJamsQty: 5, jsQty: 5, dripEdgeQty: 2 },
    "14x14": { headersQty: 2, headersType: "2x12x16LVLHeader", doorJamsQty: 5, jsQty: 5, dripEdgeQty: 2 },
    "16x8": { headersQty: 2, headersType: "2x14x18LVLHeader", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "16x10": { headersQty: 2, headersType: "2x14x18LVLHeader", doorJamsQty: 4, jsQty: 4, dripEdgeQty: 2 },
    "16x12": { headersQty: 2, headersType: "2x14x18LVLHeader", doorJamsQty: 5, jsQty: 5, dripEdgeQty: 2 },
    "16x14": { headersQty: 2, headersType: "2x14x18LVLHeader", doorJamsQty: 5, jsQty: 5, dripEdgeQty: 2 }
};
