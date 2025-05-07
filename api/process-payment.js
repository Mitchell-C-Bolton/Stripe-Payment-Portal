// Takes the existing payment intent created by "create-payment-intent.js" and processes it via the reader

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { paymentIntentId } = req.body;
        const readerId = process.env.STRIPE_READER;

        if (!paymentIntentId || !readerId) {
            return res.status(400).json({ success: false, error: 'Missing paymentIntentId or readerId' });
        }

        // Instruct the reader to process the payment
        const reader = await stripe.terminal.readers.processPaymentIntent(
            readerId, 
            {payment_intent: paymentIntentId}
    );

        res.json({ success: true, reader });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};