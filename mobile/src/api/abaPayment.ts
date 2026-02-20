// import axios from 'axios';

// export async function abaCreatePayment() {

//     var FormData = require('form-data');
//     var data = new FormData();

//     data.append('req_time', '');
//     data.append('merchant_id', '');
//     data.append('tran_id', '');
//     data.append('firstname', '');
//     data.append('lastname', '');
//     data.append('email', '');
//     data.append('phone', '');
//     data.append('type', '');
//     data.append('payment_option', '');
//     data.append('items', '');
//     data.append('shipping', '');
//     data.append('amount', '');
//     data.append('currency', '');
//     data.append('return_url', '');
//     data.append('cancel_url', '');
//     data.append('skip_success_page', '');
//     data.append('continue_success_url', '');
//     data.append('return_deeplink', '');
//     data.append('custom_fields', '');
//     data.append('return_params', '');
//     data.append('view_type', '');
//     data.append('payment_gate', '');
//     data.append('payout', '');
//     data.append('additional_params', '');
//     data.append('lifetime', '');
//     data.append('google_pay_token', '');
//     data.append('hash', '');

//     var config = {
//         method: 'post',
//         url: 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase',
//         headers: {
//             ...data.getHeaders()
//         },
//         data: data
//     };

//     axios(config)
//         .then(function (response) {
//             console.log(JSON.stringify(response.data));
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }



import React from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import CryptoJS from 'crypto-js';

export default function ABAPaymentTest() {

//   const generateHash = (dataString, apiKey) => {
//     // 1. Calculate HMAC-SHA512
//     const hmac = CryptoJS.HmacSHA512(dataString, apiKey);
//     // 2. Convert to Base64 (equivalent to PHP's base64_encode)
//     return CryptoJS.enc.Base64.stringify(hmac);
//   };

//   const handlePayment = async () => {
//     try {
//       const API_KEY = "caf065bfd0b7bd65f1e1614eb36884ffa92d0525"; // Replace with your actual key
      
//       // Define your values
//       const paymentData = {
//         req_time: "20231027100000",
//         merchant_id: "ec463658",
//         tran_id: "TEST_" + Date.now(),
//         amount: "1.00",
//         items: "", // Must match exactly if empty
//         shipping: "",
//         firstname: "John",
//         lastname: "Doe",
//         email: "test@example.com",
//         phone: "012345678",
//         type: "purchase",
//         payment_option: "abapay_deeplink",
//         return_url: "",
//         cancel_url: "",
//         continue_success_url: "",
//         return_deeplink: "",
//         currency: "USD",
//         custom_fields: "",
//         return_params: "",
//         payout: "",
//         lifetime: "",
//         additional_params: "",
//         google_pay_token: "",
//         skip_success_page: ""
//       };

//       // Concatenate strings exactly as the PHP sample does
//       // Note: Order is extremely important!
//       const b4hash = 
//         paymentData.req_time + paymentData.merchant_id + paymentData.tran_id + 
//         paymentData.amount + paymentData.items + paymentData.shipping + 
//         paymentData.firstname + paymentData.lastname + paymentData.email + 
//         paymentData.phone + paymentData.type + paymentData.payment_option + 
//         paymentData.return_url + paymentData.cancel_url + paymentData.continue_success_url + 
//         paymentData.return_deeplink + paymentData.currency + paymentData.custom_fields + 
//         paymentData.return_params + paymentData.payout + paymentData.lifetime + 
//         paymentData.additional_params + paymentData.google_pay_token + paymentData.skip_success_page;

//       const hash = generateHash(b4hash, API_KEY);

//       // 3. Initialize FormData for the API Call
//       const formData = new FormData();
//       Object.keys(paymentData).forEach(key => {
//         formData.append(key, paymentData[key]);
//       });
//       formData.append("hash", hash);

//       const response = await fetch("https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase", {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.text();
//       console.log("ABA Response:", result);
//       Alert.alert("Response Received", "Check console.");

//     } catch (error) {
//       console.error('Payment Error:', error);
//     }
//   };
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});