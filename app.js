const express = require('express')
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const {engine} = require('express-handlebars');

const app = express()
const port = process.env.port || 3000

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(`${__dirname}/public`))


app.get('/', (req, res) => {
    res.render('index')
})
app.get('/success', (req, res) => {
    res.render('success')
})
app.get('/cancel', (req, res) => {
    res.render('cancel')
})
app.post('/create-checkout-session', async (req, res) => {
    const price = (
        await stripe.prices.create({
            currency: 'usd',
            unit_amount: 1000,
            product_data: {
            name: 'Book',
            },
        })
    )
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://nodewithstripe.onrender.com/success`,
      cancel_url: `https://nodewithstripe.onrender.com/cancel`,
    });
    res.redirect(303, session.url);
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})