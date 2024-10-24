let previousWindowsQty = 0; // Track the previous quantity of windows

function updateMaterialsFromMainCard() {
    const numWindows = parseInt(document.getElementById('windowQuantity').value) || 0;

    // Calculate the difference between the new and previous quantities of windows
    const windowsDifference = numWindows - previousWindowsQty;

    // Update the windows quantity
    const currentWindowsQty = parseInt(document.getElementById('windowsQty').value) || 0;
    document.getElementById('windowsQty').value = currentWindowsQty + windowsDifference;

    // Update the headers quantity for windows without erasing existing headers
    const currentHeaderQty = parseInt(document.getElementById('2x10x10WindowHeaderQty').value) || 0;
    document.getElementById('2x10x10WindowHeaderQty').value = currentHeaderQty + windowsDifference;

    // Recalculate the rows
    calculateSteelRow('windows');
    calculateFramingRow('2x10x10WindowHeader');

    updateTotalCosts(); // Recalculate the overall total costs

    // Update the previous windows quantity for future reference
    previousWindowsQty = numWindows;
}
