// Takes the existing payment intent created by "create-payment-intent.js" and processes it via the reader
// It is processed as a MOTO payment so user will type in card info on the reader

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
        const result = await stripe.terminal.readers.processPaymentIntent(
            readerId, 
            {
            payment_intent: paymentIntentId,
            process_config: {moto: true,},
          }
        );

        res.json({ success: true, result });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};