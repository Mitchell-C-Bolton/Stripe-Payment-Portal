# Stripe Terminal Payment Portal

This project enables automatic and manual entry of credit card details and payment amounts through a frontend web interface, which communicates with a Node.js backend to process payments via a Stripe Terminal card reader.

## 🧾 Overview

This system is designed for use in a small office setting, allowing staff to manually input card information or use a physical Stripe Terminal card reader to collect payments securely and efficiently. The backend handles the creation of payment intents and processes the payments via the Stripe Terminal API.

## 🏗️ Tech Stack

- **Frontend:**  
  - HTML5 + Bootstrap for UI  
  - JavaScript for handling currency input and API requests
  - Vercel for hosting

- **Backend:**  
  - Node.js (Express)  
  - Stripe Node SDK
  - Vercel for hosting

- **Hardware:**  
  - BBPOS WisePOS E

## 📁 Project Structure

```
stripe/
│
├── public/                        # Containst all publically displayed information
│   ├── index.html         
│   ├── script.js          
│   ├── style.css          
│   └── resources/
│       ├── favicon.png
│       └── logo.png
│
├── api/                           # Contains endpoints to create, process, or cancel payments
│   ├── cancel-payment.js
│   ├── create-manual-payment.js         
│   ├── create-payment-intent.js         
│   ├── process-manual-payment.js         
│   └── process-payment.js         
│
└── package.json                   # Project dependencies
```

## ⚙️ How It Works

1. **User Interface**:  
   The frontend page lets staff manually input payment amount and then chose if the reader will wait for a card or if the user 
   must manually enter in card information (MOTO payment). 

2. **Create Payment Intent**:  
   The frontend sends a POST request to `/api/create-payment-intent` or `/api/create-manual-payment`, passing the amount to be charged.

3. **Process Payment**:  
   After receiving the Payment Intent ID, the frontend sends another POST request to `/api/process-payment` or `/api/process-manual-payment`, which sends the payment to the Stripe Terminal reader.

4. **Stripe Terminal Integration**:  
   The backend communicates with the physical card reader using Stripe's Terminal API. All card interactions (e.g., tap, insert) are handled by the reader itself.

## 🔐 Security

- Card data entry is limited to manual scenarios where PCI compliance measures are in place.
- Stripe Terminal handles all actual card processing.
- No card data is stored or transmitted by the server or frontend.

## 🚀 Setup Instructions

1. **Install dependencies**  
   ```
   npm install
   ```

2. **Set up environment variables**  
   Create a `.env.local` file:
   ```bash
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_TERMINAL_LOCATION=your_terminal_location_id
   ```

3. **Install Vercel CLI*
   ```
   npm install -g vercel
   ```

4. **Log in to Vercel*
   ```
   vercel login
   ```
   
5. **Run the development server
   ```
   vercel dev
   ```

6. Navigate via browser to your local port
   ```
   http://localhost:3000
   ```

   NOTE:
   ```
   The application will not function properly without a terminal ID to sent payment intents to.
   Front end can still be viewed. 
   ```

   
## 🧪 Testing

- Terminal reader functionality should be tested using Stripe’s official test cards and verified with physical hardware.
