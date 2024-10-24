// Track the number of floor sections
let floorSectionCount = 1;

// Function to add a new floor section
function addFloor() {
    floorSectionCount++;

    const newFloorSection = document.createElement('div');
    newFloorSection.classList.add('floor-section');
    newFloorSection.id = `floor-section-${floorSectionCount}`;
    
    newFloorSection.innerHTML = `
        <label for="floorType-${floorSectionCount}">Thickness:</label>
        <select id="floorType-${floorSectionCount}" name="floorType" required>
            <option value="4">4"</option>
            <option value="5">5"</option>
            <option value="6">6"</option>
        </select>
        <label for="floorWidth-${floorSectionCount}">Width (ft):</label>
        <input type="number" id="floorWidth-${floorSectionCount}" name="floorWidth" required />
        <label for="floorLength-${floorSectionCount}">Length (ft):</label>
        <input type="number" id="floorLength-${floorSectionCount}" name="floorLength" required />
        <label for="floorDescription-${floorSectionCount}">Description:</label>
        <input type="text" id="floorDescription-${floorSectionCount}" class="navigable" maxlength="50" />
        <button type="button" onclick="removeFloor('floor-section-${floorSectionCount}')">Remove Floor</button>
    `;

    document.getElementById('floor-sections').appendChild(newFloorSection);

    // Attach event listeners to new inputs
    newFloorSection.querySelectorAll('select, input').forEach(input => {
        input.addEventListener('input', updateConcreteFloorQty);
    });
}

// Function to remove a floor section
function removeFloor(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.remove();
        updateConcreteFloorQty(); // Recalculate quantities and costs after removal
    }
}

// Function to update the quantities of concrete floors
function updateConcreteFloorQty() {
    const floorSections = document.querySelectorAll('.floor-section');
    let totalFloorArea4 = 0, totalFloorArea5 = 0, totalFloorArea6 = 0;

    floorSections.forEach(section => {
        const id = section.id.split('-')[2];
        const width = parseFloat(document.getElementById(`floorWidth-${id}`).value) || 0;
        const length = parseFloat(document.getElementById(`floorLength-${id}`).value) || 0;
        const thickness = parseFloat(document.getElementById(`floorType-${id}`).value);
        const area = width * length;

        switch (thickness) {
            case 4:
                totalFloorArea4 += area;
                break;
            case 5:
                totalFloorArea5 += area;
                break;
            case 6:
                totalFloorArea6 += area;
                break;
        }
    });

    document.getElementById('4InchConcreteQty').value = totalFloorArea4.toFixed(2);
    document.getElementById('5InchConcreteQty').value = totalFloorArea5.toFixed(2);
    document.getElementById('6InchConcreteQty').value = totalFloorArea6.toFixed(2);

    // Update costs for each concrete type
    calculateRow('4InchConcrete');
    calculateRow('5InchConcrete');
    calculateRow('6InchConcrete');

    updateTotalCosts();
}

// Function to calculate the total cost of all floor sections
function calculateFloorCost() {
    const floorSections = document.querySelectorAll('.floor-section');
    let totalFloorCost = 0;

    floorSections.forEach(section => {
        const id = section.id.split('-')[2];
        const width = parseFloat(document.getElementById(`floorWidth-${id}`).value) || 0;
        const length = parseFloat(document.getElementById(`floorLength-${id}`).value) || 0;
        const thickness = parseFloat(document.getElementById(`floorType-${id}`).value) || 0;
        const area = width * length;
        const rate = getConcreteRate(thickness);
        const total = area * rate;

        totalFloorCost += total;
    });

    return totalFloorCost;
}

// Helper function to get the rate of concrete based on thickness
function getConcreteRate(thickness) {
    switch (thickness) {
        case 4:
            return parseFloat(document.getElementById("4InchConcreteRate").value) || 0;
        case 5:
            return parseFloat(document.getElementById("5InchConcreteRate").value) || 0;
        case 6:
            return parseFloat(document.getElementById("6InchConcreteRate").value) || 0;
        default:
            return 0;
    }
}

// Attach event listeners for initial floor inputs
document.querySelectorAll('.floor-section select, .floor-section input').forEach(input => {
    input.addEventListener('input', updateConcreteFloorQty);
});
