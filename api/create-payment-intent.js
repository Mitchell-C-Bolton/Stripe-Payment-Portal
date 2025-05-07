// Creates a payment intent and sends it to the Stripe terminal

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card_present'],
            capture_method: 'automatic',
        });

        res.json({ success: true, paymentIntentId: paymentIntent.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};