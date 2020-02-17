const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const path = require('path');
const exhbs = require('express-handlebars');

const app = express();

const port = process.env.PORT || 3000;

//set up handlebars
app.engine('handlebars', exhbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Middleware for bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//static file
app.use(express.static(path.join(__dirname, 'public')));

//index routes
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

app.post('/charge', (req, res) => {
    const amount = 1000;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount: amount,
        description: 'Dhaka topi',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'));
});

app.listen(port, (req, res) => console.log(`Server is running at${port}`));