// removes the payment intent from the reader and cancels it in the Stripe terminal. 

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const readerId = process.env.STRIPE_READER;
    const { paymentIntentId } = req.body;

    let cancelReaderResult = null;
    let cancelIntentResult = null;

    // Clears the reader
    try {
        if (!readerId) throw new Error("Stripe Reader ID is missing");
        cancelReaderResult = await stripe.terminal.readers.cancelAction(readerId);
    } catch (error) {
        console.error("Error clearing reader:", error);
        return res.status(500).json({ success: false, error: `Reader cancel failed: ${error.message}` });
    }

    // cancels in Stripe terminal
    try {
        if (!paymentIntentId) throw new Error("PaymentIntent ID is missing");
        cancelIntentResult = await stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
        console.error("Error canceling payment intent:", error);
        return res.status(500).json({ success: false, error: `PaymentIntent cancel failed: ${error.message}` });
    }

    res.json({
        success: true,
        message: "Reader action and PaymentIntent canceled",
        reader: cancelReaderResult,
        paymentIntent: cancelIntentResult
    });
};