// Function to load an image from a URL
function loadImageFromURL(url, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; // Use natural size to avoid blurriness
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
    };
    img.src = url;
}

// Main function to generate the PDF quote
function generateQuote() {
    const imageUrl = document.getElementById("logo").src;
    loadImageFromURL(imageUrl, function (logoBase64) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Adding company logo
        if (logoBase64) {
            const imgProps = { x: 10, y: 5, width: 100, height: 60 };
            doc.addImage(logoBase64, "PNG", imgProps.x, imgProps.y, imgProps.width, imgProps.height);
        }

        // Company and customer information setup
        const date = document.getElementById("date").value;
        const jobNumber = document.getElementById("jobNumber").value;
        const customerName = document.getElementById("customerName").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const address = document.getElementById("address").value;

        // Company Address Box
        const companyAddress = "Solid Structure Co.\n4567 Cedar Avenue,\nToronto, ON\nM5V 2T6";
        const addressBoxX = 40;
        const addressBoxY = 70;
        const addressBoxWidth = 40;
        const addressBoxHeight = 20;
        doc.rect(addressBoxX, addressBoxY, addressBoxWidth, addressBoxHeight);
        doc.setFontSize(10);
        doc.text(companyAddress, addressBoxX + 2, addressBoxY + 5);

        // Document Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Estimate", 173, 40, null, null, "center");

        // Customer Information Box
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 147, 50);
        doc.line(145, 52, 185, 52);
        doc.text(`Estimate # ${jobNumber}`, 147, 60);

        // Estimate Box
        const estimateBoxX = 145;
        const estimateBoxY = 45;
        const estimateBoxWidth = 40;
        const estimateBoxHeight = 20;
        doc.rect(estimateBoxX, estimateBoxY, estimateBoxWidth, estimateBoxHeight);

        // Customer Info Box
        const customerInfoX = 120;
        const customerInfoY = 70;
        const customerInfoWidth = 80;
        const customerInfoHeight = 40;
        doc.rect(customerInfoX, customerInfoY, customerInfoWidth, customerInfoHeight);
        doc.setFont("helvetica", "bold");
        doc.text("Name / Address:", 130, 75);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.line(customerInfoX, 77, customerInfoX + customerInfoWidth, 77);
        const infoLineHeight = 5;
        doc.text(`${customerName}`, 122, 82);
        const addressMaxWidth = customerInfoWidth - 10;
        const addressLines = doc.splitTextToSize(address, addressMaxWidth);
        let currentY = 82 + infoLineHeight;
        addressLines.forEach((line) => {
            doc.text(line, 122, currentY);
            currentY += infoLineHeight;
        });
        const reducedLineHeight = 2; // Use a smaller increment than infoLineHeight

        // Position phone number closer to the address
        doc.text(`${phoneNumber}`, 122, currentY + reducedLineHeight);

        // Grid and Items
        let yOffset = 130;
        const headers = ["Item", "Description", "Qty", "Rate", "Total"];
        const headerX = [12, 50, 158, 170, 185];
        const boxX = 10;
        const boxWidth = 190;
        const gridHeight = 120; // Adjusted height to not cover entire page

        // Draw the border for the grid
        doc.rect(boxX, yOffset - 10, boxWidth, gridHeight);

        headers.forEach((header, i) => {
            doc.text(header, headerX[i], yOffset - 2); // Reduced space between header text and line
        });

        // Draw line under header labels
        doc.line(boxX, yOffset, boxX + 190, yOffset);

        // Draw vertical lines for the grid
        const gridTopY = yOffset - 10; // Top of the grid
        const gridBottomY = yOffset + gridHeight - 10; // Bottom of the grid

        // Vertical line positions based on column positions
        const verticalLineXPositions = [headerX[1] - 3, headerX[2] - 3, headerX[3] - 3, headerX[4] - 3];

        verticalLineXPositions.forEach(xPos => {
            doc.line(xPos, gridTopY, xPos, gridBottomY);
        });

        let lineCounter = 0;
        let isFirstPage = true;

        // Dynamically add items based on user input
        const items = [];

        const shopDescription = document.getElementById("shopDescription").value;
        if (shopDescription || document.getElementById("buildingWidth").value || document.getElementById("buildingLength").value) {
            items.push({
                item: "Shop",
                description: shopDescription || '',
                qty: "",
                rate: "",
                total: "",
            });
        }

        const roofType = document.getElementById("roofType").value;
        const roofDescription = document.getElementById("roofDescription").value;
        if (roofDescription || document.getElementById("roofWidth").value || document.getElementById("roofLength").value) {
            const roofTypeText = roofType === "steel" ? "Steel Roof" : "Shingle Roof";
            items.push({
                item: roofTypeText,
                description: roofDescription || '',
                qty: "",
                rate: "",
                total: "",
            });
        }

        const foundationDescription = document.getElementById("foundationDescription").value;
        if (foundationDescription || document.getElementById("foundationWidth").value || document.getElementById("foundationLength").value) {
            items.push({
                item: "Concrete Foundation",
                description: foundationDescription || '',
                qty: "",
                rate: "",
                total: "",
            });
        }

        // Function to gather data for each floor section and add to PDF items
function gatherFloorSectionsForPDF() {
    // Select all floor sections
    const floorSections = document.querySelectorAll('.floor-section');

    floorSections.forEach(section => {
        const id = section.id.split('-')[2];  // Extract the dynamic part of the ID
        const qtyElement = document.getElementById(`floorWidth-${id}`);  // Use floorWidth as qty for calculation
        const rateElement = document.getElementById(`floorType-${id}`);
        const totalElement = document.getElementById(`floorLength-${id}`); // Length for total calculation
        const floorDescriptionElement = document.getElementById(`floorDescription-${id}`);  // Match ID format

        // Check if the elements exist before accessing their values
        const qty = qtyElement ? parseFloat(qtyElement.value) || 0 : 0;  // Assume width is qty for area
        const rate = rateElement ? parseFloat(rateElement.value) || 0 : 0;
        const total = totalElement ? parseFloat(totalElement.value) || 0 : 0;
        const floorDescription = floorDescriptionElement ? floorDescriptionElement.value || '' : '';  // Get description

        if (qty > 0) {
            items.push({
                item: `${rate}" Concrete Floor`,  // Dynamic item label based on thickness
                description: floorDescription,
                qty: "",
                rate: rate.toFixed(2),
                total: (qty * total).toFixed(2),  // Assuming total is calculated as qty * length
            });
        }
    });
}

// Call this function to add floor data to PDF items
gatherFloorSectionsForPDF();

function gatherGarageDoorSectionsForPDF() {
    // Select all garage door sections
    const garageDoorSections = document.querySelectorAll('.garage-door-section');

    garageDoorSections.forEach(section => {
        // Safely get doorSize, doorQuantity, and description elements
        const doorSizeElement = section.querySelector(`[id^="doorSizes-"]`);
        const doorQuantityElement = section.querySelector(`[id^="doorQuantity-"]`);
        const descriptionElement = section.querySelector(`[id^="garageDoorDescription-"]`);

        // Check for null elements before accessing their values
        if (!doorSizeElement) {
            console.error("doorSizeElement not found:", section);
        }
        if (!doorQuantityElement) {
            console.error("doorQuantityElement not found:", section);
        }
        if (!descriptionElement) {
            console.error("descriptionElement not found:", section);
        }

        if (doorSizeElement && doorQuantityElement && descriptionElement) {
            const doorSize = doorSizeElement.value; 
            const doorQuantity = parseInt(doorQuantityElement.value) || 0;
            const description = descriptionElement.value.trim();  // Trim to remove extra spaces

            if (doorSize && doorQuantity > 0) {
                // Push item with the correct description
                items.push({
                    item: `Garage Door ${doorSize}`,
                    description: description,  // Use the correct variable here
                    qty: doorQuantity.toString(),
                    rate: "",
                    total: "",
                });
            }
        }
    });
}

// Example call to gather data for PDF
gatherGarageDoorSectionsForPDF();



        const manDoorsCount = parseInt(document.getElementById("numManDoors").value, 10) || 0;
        const manDoorDescription = document.getElementById("manDoorDescription").value;
        if (manDoorsCount > 0 || manDoorDescription) {
            items.push({
                item: "Man Door",
                description: manDoorDescription || '',
                qty: manDoorsCount > 0 ? manDoorsCount.toString() : "",
                rate: "",
                total: "",
            });
        }

        const windowCount = parseInt(document.getElementById("windowQuantity").value, 10) || 0;
        const windowDescription = document.getElementById("windowDescription").value;
        if (windowCount > 0 || windowDescription) {
            items.push({
                item: "Window",
                description: windowDescription || '',
                qty: windowCount > 0 ? windowCount.toString() : "",
                rate: "",
                total: "",
            });
        }

        const extraDescription = document.getElementById("extraDescription").value;
        if (extraDescription) {
            items.push({
                item: "Extra",
                description: extraDescription,
                qty: "",
                rate: "",
                total: "",
            });
        }

        // Then proceed with adding these items to the PDF as before
        items.forEach(item => {
            yOffset += 5;
            lineCounter++;

            // Check if it's time to add a new page
            if ((isFirstPage && lineCounter === 20) || (!isFirstPage && lineCounter % 30 === 0)) {
                doc.addPage();
                yOffset = 20;
                lineCounter = 0;
                isFirstPage = false;

                // Draw grid for the new page
                doc.rect(boxX, yOffset - 10, boxWidth, gridHeight + 60);

                // Redraw headers on the new page
                headers.forEach((header, i) => {
                    doc.text(header, headerX[i], yOffset - 3);
                });
                doc.line(boxX, yOffset, boxX + 190, yOffset);

                // Redraw vertical lines for the grid
                const gridTopYNewPage = yOffset - 10;
                const gridBottomYNewPage = yOffset + gridHeight + 50;

                verticalLineXPositions.forEach(xPos => {
                    doc.line(xPos, gridTopYNewPage, xPos, gridBottomYNewPage);
                });

                yOffset += 10; // Adjust yOffset after drawing headers to avoid overlap
            }

            // Ensure item properties are formatted correctly for the PDF
            const itemRate = typeof item.rate === 'number' ? item.rate.toFixed(2) : '';
            const itemTotal = typeof item.total === 'number' ? item.total.toFixed(2) : '';

            // Add item details to the PDF
            doc.text(item.item, headerX[0], yOffset);
            doc.text(item.description, headerX[1], yOffset);
            doc.text(item.qty.toString(), headerX[2], yOffset);
            doc.text(itemRate, headerX[3], yOffset);
            doc.text(itemTotal, headerX[4], yOffset);
        });

       // Fixed position for totals box
const totalsBoxY = 240; // Fixed position towards the bottom of the page
const totalsBoxHeight = 30;
doc.rect(boxX + 140, totalsBoxY, 50, totalsBoxHeight);

doc.setFontSize(12);
doc.setFont("helvetica", "bold");
doc.text("Subtotal:", boxX + 142, totalsBoxY + 8);
doc.text("GST/HST:", boxX + 142, totalsBoxY + 18);
doc.text("Total:", boxX + 142, totalsBoxY + 28);
doc.setFont("helvetica", "normal");

// Fetching totals from the HTML
const subtotalText = document.getElementById("subTotal").textContent.trim().replace('$', '');
const taxAmountText = document.getElementById("taxAmount").textContent.trim().replace('$', '');
const totalText = document.getElementById("totalAll").textContent.trim().replace('$', '');

const subtotal = parseFloat(subtotalText) || 0;
const taxAmountValue = parseFloat(taxAmountText) || 0;
const totalValue = parseFloat(totalText) || 0;

// Format the numbers to include commas and dollar sign
const formatCurrency = (num) => {
    return "$" + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

doc.text(formatCurrency(subtotal), boxX + 188, totalsBoxY + 8, { align: "right" });
doc.text(formatCurrency(taxAmountValue), boxX + 188, totalsBoxY + 18, { align: "right" });
doc.text(formatCurrency(totalValue), boxX + 188, totalsBoxY + 28, { align: "right" });

doc.line(boxX + 140, totalsBoxY + 10, boxX + 190, totalsBoxY + 10);
doc.line(boxX + 140, totalsBoxY + 20, boxX + 190, totalsBoxY + 20);


        // GST/HST and Verse Box at the bottom of the page
        const gstHstLabelX = 10;
        const gstHstLabelY = 260;
        doc.setFont("helvetica");
        doc.text("GST/HST NO.", gstHstLabelX, gstHstLabelY);
        doc.setFont("helvetica", "normal");
        doc.text("1234 5678 RT0001", gstHstLabelX, gstHstLabelY + 5);

        const verseBoxX = 75;
        const verseBoxY = 242;
        const verseBoxWidth = 50;
        const verseBoxHeight = 30;
        doc.rect(verseBoxX, verseBoxY, verseBoxWidth, verseBoxHeight);
        const verseText = "There is therefore now no \ncondemnation to them \nwhich are in Christ \nJesus, who walk not after \nthe flesh, but after the \nspirit.\nROM 8:1";
        doc.setFont("times", "italic");
        doc.setFontSize(10);
        const verseTextY = verseBoxY + 5;
        doc.text(verseText, verseBoxX + verseBoxWidth / 2, verseTextY, { align: "center" });

        doc.save(`shop_quote_${customerName}.pdf`); // Use backticks for template literal
    });
}

document.getElementById("getQuoteButton").addEventListener("click", generateQuote);
