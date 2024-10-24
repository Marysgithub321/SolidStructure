
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize prices and update initial total costs
        initializePrices(); 
        updateTotalCosts(); 
    
        // Event listeners for grid inputs
        document.querySelectorAll('.grid-input').forEach(input => {
            input.addEventListener('input', (event) => {
                const rowId = event.target.id.replace(/Qty|Rate|Markup/, '');
                calculateRow(rowId); 
                updateTotalCosts(); 
            });
        });
    
        // Dropdown button event listener
        document.querySelector('.dropbtn').addEventListener('click', () => {
            document.querySelector('.dropdown-content').classList.toggle('hidden');
        });
    
        // Update prices button inside the dropdown
        document.querySelector('.dropdown-content button').addEventListener('click', () => {
            updatePrices(); 
            updateTotalCosts(); 
        });
    
        // Event listeners for buttons and inputs
        document.getElementById('getQuoteButton').addEventListener('click', generateQuote);
        document.getElementById('priceBreakdownButton').addEventListener('click', generatePriceBreakdown);
    
        // Specific inputs to update materials
        document.getElementById('windowQuantity').addEventListener('input', () => {
            updateMaterialsFromMainCard();
            updateTotalCosts();
        });
    
        document.getElementById('foundationWidth').addEventListener('input', () => {
            updateConcreteFoundationQty();
            updateTotalCosts();
        });
    
        document.getElementById('foundationLength').addEventListener('input', () => {
            updateConcreteFoundationQty();
            updateTotalCosts();
        });
    
    

document.getElementById('numManDoors').addEventListener('input', () => {
    updateMaterialsForManDoors();
    updateTotalCosts();
});

    
        // Roof-related inputs
        document.getElementById('roofType').addEventListener('change', () => {
            updateRoofingMaterials();
            updateTotalCosts();
        });
    
        document.getElementById('roofWidth').addEventListener('input', () => {
            updateRoofingMaterials();
            updateTotalCosts();
        });
    
        document.getElementById('roofLength').addEventListener('input', () => {
            updateRoofingMaterials();
            updateTotalCosts();
        });
    
        // Building dimensions
        const dimensionInputs = ['buildingHeight', 'buildingWidth', 'buildingLength'];
        dimensionInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                updateBuildingMaterials();
                updateFramingMaterials();
                updateCornerWithJMaterials();
                updateWallSQFQty();
                updateRidgeCapQty();
                updateRatGuardQty();
                updateGableDividerQty();
                updateplates2x6x16Qty();
                updateTotalCosts(); 
            });
        });
    
        // Initialize other quantities and materials
        updateWallSQFQty();
        updateRatGuardQty();
        updateGableDividerQty();
        updateplates2x6x16Qty();
        updateFramingMaterials();
    
        // Drip Edge inputs
        document.getElementById('dripEdgeQty').addEventListener('input', () => {
            calculateSteelRow('dripEdge');
            updateTotalCosts();
        });
    
        document.getElementById('dripEdgeRate').addEventListener('input', () => {
            calculateSteelRow('dripEdge');
            updateTotalCosts();
        });
    
        document.getElementById('dripEdgeMarkup').addEventListener('input', () => {
            calculateSteelRow('dripEdge');
            updateTotalCosts();
        });
    
      
    });