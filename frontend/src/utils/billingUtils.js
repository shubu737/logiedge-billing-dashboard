// billingUtils.js
// Helper functions used for billing calculations on the frontend.
// These are kept here so the same logic is not repeated in multiple files.

const GST_RATE = 0.18; // 18% GST

// Calculate GST amount
// If the customer is GST registered, we return 0 (no GST charged)
// If the customer is NOT GST registered, we charge 18% on the subtotal
export function calculateGST(subtotal, isGstRegistered) {
    if (isGstRegistered) {
        return 0;
    }
    return parseFloat((subtotal * GST_RATE).toFixed(2));
}

// Calculate the final total
// Total = subtotal + GST amount
export function calculateTotal(subtotal, gstAmount) {
    return parseFloat((subtotal + gstAmount).toFixed(2));
}

// Format a number as Indian Rupees
// Example: 85000 becomes ₹85,000.00
export function formatCurrency(amount) {
    const number = parseFloat(amount) || 0;
    return '₹' + number.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}
