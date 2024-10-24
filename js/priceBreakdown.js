function loadImageFromURL(url, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
    };
    img.src = url;
}
function generatePriceBreakdown() {
    const imageUrl = document.getElementById("logo").src;
    loadImageFromURL(imageUrl, function (logoBase64) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add company logo
        if (logoBase64) {
            doc.addImage(logoBase64, "PNG", 10, 5, 100, 60);
        }

        // Company and customer information
        const date = document.getElementById("date").value;
        const jobNumber = document.getElementById("jobNumber").value;
        const customerName = document.getElementById("customerName").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const address = document.getElementById("address").value;

        // Company Address Box
        const companyAddress = "Solid Structure Co.\n4567 Cedar Avenue,\nToronto, ON\nM5V 2T6";
        doc.setFontSize(10);
        doc.rect(40, 70, 40, 20);
        doc.text(companyAddress, 42, 75);

        // Document Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Price Breakdown", 165, 40, null, null, "center");

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
        doc.rect(120, 70, 80, 40);
        doc.setFont("helvetica", "bold");
        doc.text(`Name / Address:`, 130, 75);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.line(120, 77, 200, 77);
        const infoLineHeight = 5;
        doc.text(`${customerName}`, 122, 82);
        const addressLines = doc.splitTextToSize(address, 70);
        let currentY = 87;
        addressLines.forEach((line) => {
            doc.text(line, 122, currentY);
            currentY += infoLineHeight;
        });
        const reducedLineHeight = 2; // Use a smaller increment than infoLineHeight

        // Position phone number closer to the address
        doc.text(`${phoneNumber}`, 122, currentY + reducedLineHeight);

        // Grid and Items
        let yOffset = 130;
        const headers = ["Item", "Qty", "Rate", "Markup", "Total"];
        const headerX = [12, 68, 98, 128, 158];
        const boxX = 10;
        const boxWidth = 190;
        const gridHeight = 120;

        // Draw the border for the grid
        doc.rect(boxX, yOffset - 10, boxWidth, gridHeight);

        headers.forEach((header, i) => {
            doc.text(header, headerX[i], yOffset - 3);
        });

        doc.line(boxX, yOffset, boxX + 190, yOffset);

        // Vertical line positions for the grid
        const verticalLineXPositions = [headerX[1] - 3, headerX[2] - 3, headerX[3] - 3, headerX[4] - 3];
        verticalLineXPositions.forEach(xPos => {
            doc.line(xPos, yOffset - 10, xPos, yOffset + gridHeight - 10);
        });

        let lineCounter = 0;
        let isFirstPage = true;

        // Gather all materials with non-zero quantity
        const items = [];
        document.querySelectorAll('#buildingMaterials .grid-container').forEach(container => {
            container.querySelectorAll('input[type="number"]').forEach((input) => {
                const qty = parseFloat(input.value);
                if (qty > 0) {
                    const itemId = input.id.replace(/Qty$/, '');
                    const labelElement = document.querySelector(`label[for="${input.id}"]`);
                    const itemName = labelElement ? labelElement.textContent.trim() : (input.previousElementSibling ? input.previousElementSibling.textContent.trim() : ""); 

                    if (itemName) {
                        const rateElement = document.getElementById(`${itemId}Rate`);
                        const markupElement = document.getElementById(`${itemId}Markup`);
                        const totalElement = document.getElementById(`${itemId}Total`);

                        if (rateElement && markupElement && totalElement) {
                            const rate = parseFloat(rateElement.value) || 0;
                            const markup = parseFloat(markupElement.value) || 0;
                            const total = parseFloat(totalElement.textContent) || 0;

                            items.push({
                                item: itemName,
                                qty: qty,
                                rate: rate,
                                markup: markup,
                                total: total
                            });
                        }
                    }
                }
            });
        });

        // Add items to PDF
items.forEach(item => {
    yOffset += 5;  // Adjust this value if needed to fit the number of lines properly
    lineCounter++;

    // Check if it's time to add a new page
    if ((isFirstPage && lineCounter === 20) || (!isFirstPage && lineCounter % 30 === 0)) {
        doc.addPage(); // Add a new page
        yOffset = 20;  // Reset yOffset for the new page
        lineCounter = 0;  // Reset line counter for the new page
        isFirstPage = false;  // Mark that subsequent pages are not the first page

        // Draw grid for the new page
        doc.rect(boxX, yOffset - 10, boxWidth, gridHeight + 60); // Adjust gridHeight to fit 30 lines on subsequent pages

        // Redraw headers on the new page
        headers.forEach((header, i) => {
            doc.text(header, headerX[i], yOffset - 3);
        });
        doc.line(boxX, yOffset, boxX + 190, yOffset);

        // Redraw vertical lines for the grid
        const gridTopYNewPage = yOffset - 10; // Top of the grid on the new page
        const gridBottomYNewPage = yOffset + gridHeight + 50; // Bottom of the grid on the new page, adjusted to fit 30 lines

        verticalLineXPositions.forEach(xPos => {
            doc.line(xPos, gridTopYNewPage, xPos, gridBottomYNewPage);
        });

        // Adjust yOffset after drawing the headers to avoid overlap
        yOffset += 10; // Increment yOffset to create space below headers (adjust this value if needed)
    }

    // Add item details to the PDF
    doc.text(item.item, headerX[0], yOffset);
    doc.text(item.qty.toString(), headerX[1], yOffset);
    doc.text(item.rate.toFixed(2), headerX[2], yOffset);
    doc.text(item.markup.toFixed(2), headerX[3], yOffset);
    doc.text(item.total.toFixed(2), headerX[4], yOffset);
});


       // Totals box
const subtotalText = document.getElementById("subTotal").textContent.trim().replace('$', '');
const taxAmountText = document.getElementById("taxAmount").textContent.trim().replace('$', '');
const totalText = document.getElementById("totalAll").textContent.trim().replace('$', '');

const subtotal = parseFloat(subtotalText) || 0;
const taxAmountValue = parseFloat(taxAmountText) || 0;
const totalValue = parseFloat(totalText) || 0;

const totalsBoxY = 240;
doc.rect(boxX + 140, totalsBoxY, 50, 30);

doc.setFontSize(12);
doc.setFont("helvetica", "bold");
doc.text("Subtotal:", boxX + 142, totalsBoxY + 8);
doc.text("GST/HST:", boxX + 142, totalsBoxY + 18);
doc.text("Total:", boxX + 142, totalsBoxY + 28);
doc.setFont("helvetica", "normal");

// Format the numbers to include commas and dollar sign
const formatCurrency = (num) => {
    return "$" + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

// Display formatted currency values in the totals box
doc.text(formatCurrency(subtotal), boxX + 188, totalsBoxY + 8, { align: "right" });
doc.text(formatCurrency(taxAmountValue), boxX + 188, totalsBoxY + 18, { align: "right" });
doc.text(formatCurrency(totalValue), boxX + 188, totalsBoxY + 28, { align: "right" });

doc.line(boxX + 140, totalsBoxY + 10, boxX + 190, totalsBoxY + 10);
doc.line(boxX + 140, totalsBoxY + 20, boxX + 190, totalsBoxY + 20);


        // Save PDF
        doc.save(`shop_breakdown_${customerName}.pdf`);
    });
}

document.getElementById("priceBreakdownButton").addEventListener("click", generatePriceBreakdown);
