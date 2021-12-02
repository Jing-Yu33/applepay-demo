const express = require('express')
const axios = require('axios')
const https = require('https')
const bodyParser = require('body-parser')
const express2 = _interopRequireDefault(express);


const bodyParser2 = _interopRequireDefault(bodyParser);

const fs = require('fs')
var fs2 = _interopRequireDefault(fs);

const cors = require('cors')
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const app = express()

// var options = {
// 	index: 'index.html'
// };
const app = (0, express2.default)();
app.use(express2.default.static('frontend'));
app.use('/.well-known', express2.default.static('.well-known'));
app.use(bodyParser2.default.json());
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// )
// const port = process.env.PORT || 8080;

app.use(cors());
// app.options('*', cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");

//   next();
// });
app.listen(process.env.PORT || 5500
, () => {
  console.log('Server running on port haha')
})


var applePayCert = fs2.default.readFileSync('./backend/certificates/certificate_sandbox.pem');
var applePayKey = fs2.default.readFileSync('./backend/certificates/certificate_sandbox.key');


// Validate the Apple Pay session
app.post('/validateSession', (req, res) => {
  const { appleUrl } = req.body
  console.log("url is here: " + appleUrl)
  // used to send the apple certificate
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: applePayCert,
    key: applePayKey
  })
  // extract the appleUrl from the POST request body
  // const { appleUrl } = req.body
  // res.send('ok');
  // console.log(appleUrl)
  // using AXIOS to do the POST request but any HTTP client can be used
  axios
    .post(
      // appleUrl,
      "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",  // TODO: change back to appleUrl
      {
        merchantIdentifier: '211CF14E7604A38BCA391348A8576CE408D25A64AD201C235D9D64E5BAAE55F0',
        displayName: 'wepay test',
        initiative: "web",
        initiativeContext: "enigmatic-retreat-54006.herokuapp.com"
      },
      
      { httpsAgent, 
        headers: {
          "Content-Type": "application/json", // TODO: check if this is necessary
        } }
    )
    .then(function (response) {
        console.log("response from apple pay: " + JSON.stringify(response.data))
      res.send(response.data)
    })
})

// Tokenise the Apple Pay payload and perform a payment
app.post('/pay', (req, res) => {
  const {
    version,
    data,
    signature,
    header
  } = req.body.details.token.paymentData

  // here we first generate a checkout.com token using the ApplePay
  // axios
  //   .post(
  //     'https://api.sandbox.checkout.com/tokens',
  //     {
  //       type: 'applepay',
  //       token_data: {
  //         version: version,
  //         data: data,
  //         signature: signature,
  //         header: {
  //           ephemeralPublicKey: header.ephemeralPublicKey,
  //           publicKeyHash: header.publicKeyHash,
  //           transactionId: header.transactionId
  //         }
  //       }
  //     },
  //     {
  //       // notice in this first API call we use the public key
  //       headers: {
  //         Authorization: process.env.PUBLIC_KEY
  //       }
  //     }
  //   )
  //   .then(function (response) {
  //     // Checkout.com token
  //     const ckoToken = response.data.token
  //     const { billingContact, shippingContact } = req.body.details
  //     // Now we simply do a payment request with the checkout token
  //     axios
  //       .post(
  //         'https://api.sandbox.checkout.com/payments',
  //         {
  //           source: {
  //             type: 'token',
  //             token: ckoToken,
  //             billing_address: {
  //               address_line1: billingContact.addressLines[0],
  //               address_line2: billingContact.addressLines[1],
  //               city: billingContact.locality,
  //               state: billingContact.country,
  //               zip: billingContact.postalCode,
  //               country: billingContact.countryCode
  //             }
  //           },
  //           customer: {
  //             email: shippingContact.emailAddress
  //           },
  //           shipping: {
  //             address_line1: shippingContact.addressLines[0],
  //             address_line2: shippingContact.addressLines[1],
  //             city: shippingContact.locality,
  //             state: shippingContact.country,
  //             zip: shippingContact.postalCode,
  //             country: shippingContact.countryCode
  //           },
  //           amount: 1000,
  //           currency: 'USD',
  //           reference: 'ORD-5023-4E89'
  //         },
  //         {
  //           // notice in this API call we use the secret key
  //           headers: {
  //             Authorization: process.env.SECRET_KEY
  //           }
  //         }
  //       )
  //       .then(function (response) {
  //         res.send(response.data) // sent back the payment response
  //       })
  //   })
  //   .catch(function (er) {
  //     console.log(er)
  //   })
})
