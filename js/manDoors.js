let previousManDoorsQty = 0; // Track the previous quantity of man doors

function updateMaterialsForManDoors() {
    const numManDoors = parseInt(document.getElementById('numManDoors').value) || 0;

    // Calculate the difference between the new and previous quantities
    const manDoorsDifference = numManDoors - previousManDoorsQty;

    // Update the man doors quantity directly
    const currentManDoorsQty = parseInt(document.getElementById('manDoorsQty').value) || 0;
    document.getElementById('manDoorsQty').value = currentManDoorsQty + manDoorsDifference;

    // Update the headers quantity (increment by the difference)
    const currentHeaderQty = parseInt(document.getElementById('2x10x8HeaderQty').value) || 0;
    document.getElementById('2x10x8HeaderQty').value = currentHeaderQty + manDoorsDifference;

    // Update the Man Door J's quantity (3 J's per man door, increment based on the difference)
    const currentManDoorJQty = parseInt(document.getElementById('manDoorJQty').value) || 0;
    document.getElementById('manDoorJQty').value = currentManDoorJQty + (manDoorsDifference * 3);

    // Update the Man Door Drip Edge quantity (1 drip edge per man door, increment based on the difference)
    const currentManDoorDripEdgeQty = parseInt(document.getElementById('manDoorDripEdgeQty').value) || 0;
    document.getElementById('manDoorDripEdgeQty').value = currentManDoorDripEdgeQty + manDoorsDifference;

    // Recalculate the rows
    calculateSteelRow('manDoors');
    calculateFramingRow('2x10x8Header');
    calculateSteelRow('manDoorJ');
    calculateSteelRow('manDoorDripEdge');

    updateTotalCosts(); // Recalculate the overall total costs

    // Update the previous man doors quantity for future reference
    previousManDoorsQty = numManDoors;
}
