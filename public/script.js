// Format currency bellow text field as the user types
function formatCurrency(event) {
    let input = event.target;
    let value = input.value.replace(/[^0-9.]/g, '');
    let displayField = document.getElementById("formattedAmount");

    if (value) {
        let formattedValue = parseFloat(value).toFixed(2);
        formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        displayField.innerText = 'Total: $' + formattedValue;
    } else {
        displayField.innerText = 'Total:';
    }
}

// Handle the form submission and prepare the amount for Stripe
async function handleSubmit(event) {

    event.preventDefault();

    let paymentAmount = document.getElementById('PaymentAmount').value.trim();
    paymentAmount = paymentAmount.replace(/,/g, '');

    // Checks the input is a number
    if (isNaN(paymentAmount)) { 
        console.error("Invalid amount:", paymentAmount);
        alert("Please enter a valid payment amount.");
        return;
    }

    // Formats the number for Stripe
    if (paymentAmount.includes(".")) { 
        let parts = paymentAmount.split(".");
        let whole = parts[0];
        let decimal = parts[1] ? parts[1].substring(0, 2).padEnd(2, '0') : '00';
        paymentAmount = whole + decimal;
    } else {
        paymentAmount = paymentAmount + "00"; 
    }

    let amountInCents = parseInt(paymentAmount, 10);

    // Checks the input is a number greater than 0
    if (isNaN(amountInCents) || amountInCents <= 0) { 
        console.error("Invalid amount:", paymentAmount);
        alert("Please enter a valid payment amount.");
        return;
    }

    console.log("Stripe amount sent:", amountInCents);

    // Create payment intent in Stripe
    let intentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents }) 
    });

    let intentData = await intentResponse.json();
    if (!intentData.success) throw new Error("Failed to create payment intent");

    let paymentIntentId = intentData.paymentIntentId;
    window.latestPaymentIntentId = paymentIntentId;

    // Process payment on reader
    let processResponse = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId })
    });

    let processData = await processResponse.json();
    if (processData.success) {
        console.log("Payment sent to terminal");
    } else {
        console.error(processData.error || "Payment processing failed");
        throw new Error(processData.error || "Payment processing failed");
    }

}

// Manually submit a payment
async function manualSubmit(event) {

    let paymentAmount = document.getElementById('PaymentAmount').value.trim();
    paymentAmount = paymentAmount.replace(/,/g, '');

    // Checks the input is a number
    if (isNaN(paymentAmount)) { 
        console.error("Invalid amount:", paymentAmount);
        alert("Please enter a valid payment amount.");
        return;
    }

    //formats the number for Stripe
    if (paymentAmount.includes(".")) { 
        let parts = paymentAmount.split(".");
        let whole = parts[0];
        let decimal = parts[1] ? parts[1].substring(0, 2).padEnd(2, '0') : '00';
        paymentAmount = whole + decimal;
    } else {
        paymentAmount = paymentAmount + "00"; 
    }

    let amountInCents = parseInt(paymentAmount, 10);

    // Checks the input is a number greater than 0
    if (isNaN(amountInCents) || amountInCents <= 0) { 
        console.error("Invalid amount:", paymentAmount);
        alert("Please enter a valid payment amount.");
        return;
    }

    console.log("Stripe amount sent:", amountInCents);

    // Create payment intent in Stripe
    let intentResponse = await fetch("/api/create-manual-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents })
    });

    let intentData = await intentResponse.json();
    if (!intentData.success) throw new Error("Failed to create payment intent");

    let paymentIntentId = intentData.paymentIntentId;
    window.latestPaymentIntentId = paymentIntentId;

    // Process payment
    let processResponse = await fetch("/api/process-manual-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId })
    });

    let processData = await processResponse.json();
    if (processData.success) {
        console.log("Payment sent to terminal");
    } else {
        console.log(processData.error || "Payment processing failed");
        throw new Error(processData.error || "Payment processing failed");
    }

}

// Cancel an existing payment
async function cancelPayment() {
    try {
        console.log("Attempting to cancel payment...");

        const paymentIntentId = window.latestPaymentIntentId;

        if (!paymentIntentId) {
            throw new Error("No paymentIntentId available to cancel.");
        }

        let response = await fetch("/api/cancel-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId })
        });

        let data = await response.json();

        if (data.success) {
            console.log("Payment canceled successfully!");
        } else {
            console.error("Error: " + data.error);
            throw new Error("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error canceling payment:", error);
        alert("Failed to cancel payment: " + error.message);
    }
}

// Dark mode
const darkModeToggle = document.getElementById('darkModeToggle');
const logo = document.getElementById('logo');

darkModeToggle.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        logo.style.filter = 'invert(1)';
    } else {
        logo.style.filter = 'none';
    }
});