// billingUtils.js
// Helper functions used for billing calculations on the backend.
// These are kept here so the same logic is not repeated in multiple files.

const GST_RATE = 0.18; // 18% GST

// Generate a unique invoice ID like INVC123456
// We pick a random 6 digit number and add INVC in front
function generateInvoiceId() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return 'INVC' + randomNumber;
}

// Calculate GST amount
// If the customer is GST registered, we return 0 (no GST charged)
// If the customer is NOT GST registered, we charge 18% on the subtotal
function calculateGST(subtotal, isGstRegistered) {
    if (isGstRegistered) {
        return 0;
    }
    return parseFloat((subtotal * GST_RATE).toFixed(2));
}

// Calculate the final total
// Total = subtotal + GST amount
function calculateTotal(subtotal, gstAmount) {
    return parseFloat((subtotal + gstAmount).toFixed(2));
}

module.exports = { generateInvoiceId, calculateGST, calculateTotal };
