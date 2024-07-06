import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";

//Load variables
dotenv.config();

// Start server 
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Home Route
app.get("/", (req, res) =>  {
    res.sendFile("cart.html", {root: "public" });
});

//Success
app.get("/success", (req, res) =>  {
    res.sendFile("success.html", {root: "public" });
});

//Cancel
app.get("/cancel", (req, res) =>  {
    res.sendFile("cancel.html", {root: "public" });
});


// Stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseFloat(item.price) * 100;
        console.log("item-price: ", item.price);
        console.log("unitAmount", unitAmount);
        console.log("item-image: ", item.image); // Log the image URL to verify
        return{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    description: `Size: ${item.size}`,
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems: ", lineItems);
    

    // Create Checkout Session
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,
        // Asking Address in Stripe Checkout Page
        billing_address_collection: 'required',
    });
    res.json(session.url);
});


app.listen(3000, () => {
    console.log("listening on port 3000;");
});