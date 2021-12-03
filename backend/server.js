const express = require('express')
const axios = require('axios')
const https = require('https')
const bodyParser = require('body-parser')
const express2 = _interopRequireDefault(express);


const bodyParser2 = _interopRequireDefault(bodyParser);

const fs = require('fs')
const fs2 = _interopRequireDefault(fs);

const cors = require('cors')

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, express2.default)();

app.use(express2.default.static('frontend'));
app.use('/.well-known', express2.default.static('.well-known'));
app.use(bodyParser2.default.json());

app.use(cors());

app.listen(process.env.PORT || 5500
, () => {
  console.log('Server is running.')
})


var applePayCert = fs2.default.readFileSync('./backend/certificates/certificate_sandbox.pem');
var applePayKey = fs2.default.readFileSync('./backend/certificates/certificate_sandbox.key');


// Validate the Apple Pay session
app.post('/validateSession', (req, res) => {
  const { appleUrl } = req.body
  // used to send the apple certificate
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: applePayCert,
    key: applePayKey
  })
  // extract the appleUrl from the POST request body

  // using AXIOS to do the POST request but any HTTP client can be used
  axios
    .post(
      appleUrl,
      {
        merchantIdentifier: 'merchant.com.wepay.test20210301a',
        displayName: 'WePay ApplePay Demo',
        initiative: "web",
        initiativeContext: "enigmatic-retreat-54006.herokuapp.com"    // verified domain name
      },
      
      { httpsAgent
        // headers: {
        //   "Content-Type": "application/json", // TODO: check if this is necessary
        // } 
    }
    )
    .then(function (response) {
        console.log("response from apple pay: " + JSON.stringify(response.data))
        res.send(response.data)
    })
})

// // Tokenise the Apple Pay payload and perform a payment
// app.post('/pay', (req, res) => {
//   const {
//     version,
//     data,
//     signature,
//     header
//   } = req.body.details.token.paymentData

//   res.send(req.body)
// })
