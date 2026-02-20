export interface Model {
    /**
     * Currently, we support WeChat Mini Program. These are the values key `wechat sub_appid`
     * and `wechat_sub_openid`.
     *
     * **PHP Sample Code**
     *
     * ```php
     * $additional_params = base64_encode(json_encode([
     * 'wechat_sub_appid' => 'YOUR WECHAT APP ID',
     * 'wechat_sub_openid' => 'YOUR WECHAT OPEN ID'
     * ]));
     * ```
     */
    additional_params?: string;
    /**
     * Purchase amount.
     */
    amount: number;
    /**
     * The URL to redirect to after the user closes the payment dialog or when user cancel the
     * payment.
     */
    cancel_url?: string;
    /**
     * The URL to redirect to after a successful payment.
     */
    continue_success_url?: string;
    /**
     * Transaction currency of the payment. If you don't pass any value, it will take default
     * value from your merchant profile (the first account's the currency of the first account
     * you registered). Supported values are `KHR` or `USD`.
     */
    currency?: string;
    /**
     * Additional information that you want to attach to the transaction. This information will
     * appear in the transaction list, transaction details and export report. It's
     * base64-encoded JSON info.
     *
     * **PHP Sample Code**
     *
     * ```php
     * $custom_field = base64_encode(json_encode([
     * "field1" => "myvalue1",
     * "field2" => "myvalue2"
     * ]));
     * ```
     */
    custom_fields?: string;
    /**
     * Buyer's email.
     */
    email?: string;
    /**
     * Buyer's first name.
     */
    firstname?: string;
    /**
     * This field is required if `payment_option` is set to `google_pay` and the payment
     * selection is managed by the merchant. For detailed instructions, please refer to the
     * [Google Pay](/878723m0) integration guidelines.
     */
    google_pay_token?: string;
    /**
     * Base64 encode of hash hmac sha512 encryption of concatenates values
     * `req_time`,`merchant_id`,`tran_id`,`amount`,`items`,`shipping`,`firstname`,`lastname`,`email`,`phone`,`type`,`payment_option`,`return_url`,`cancel_url`,`continue_success_url`,`return_deeplink`,`currency`,`custom_fields`,`return_params`,`payout`,`lifetime`,`additional_params`,
     * `google_pay_token` and `skip_success_page` with `public_key`.
     *
     *
     *
     * **PHP Sample Code**
     * ```php
     * // public key provided by ABA Bank
     * $api_key = "API KEY PROVIDED BY ABA BANK";
     *
     * // Prepare the data to be hashed
     * $b4hash = $req_time . $merchant_id . $tran_id . $amount . $items . $shipping . $firstname
     * . $lastname . $email . $phone . $type . $payment_option . $return_url . $cancel_url .
     * $continue_success_url . $return_deeplink . $currency . $custom_fields . $return_params .
     * $payout . $lifetime . $additional_params . $google_pay_token .$skip_success_page;
     *
     *
     * // Generate the HMAC hash using SHA-512 and encode it in Base64
     * $hash = base64_encode(hash_hmac('sha512', $b4hash, $api_key, true));
     * ```
     */
    hash: string;
    /**
     * A base64-encoded JSON array describing the items being purchased.
     *
     * **PHP Sample Code**
     *
     * ```php
     * $item = base64_encode(json_encode([
     * ["name" => "product 1","quantity" => 1,"price" => 1.00],
     * ["name" => "product 2","quantity" => 2, "price" => 4.00]
     * ]));
     * ```
     * **Note: This is only description/remark.  The price or quantity in this info will not be
     * used for calculation or any validation purposes**
     */
    items?: string;
    /**
     * Buyer's last name.
     */
    lastname?: string;
    /**
     * The payment's lifetime in minutes, once it exceeds customer will not allow to make
     * payment.  Default value is 30 days.
     * - Min: 3 mins
     * - Max: 30 days
     *
     * - For ABA PAY or Card: Transaction will not go throught.
     * - KHQR: In case payment happen after exceed life time, PayWay will also reject. Fund will
     * be reverse back to payer.
     * - WeChat & Alipay: No reversal.
     */
    lifetime?: number;
    /**
     * A unique merchant key which provided by ABA Bank.
     */
    merchant_id: string;
    /**
     * If your merchant profile also supports the **QR Payment API** service, please set this
     * parameter to `0` to use the Checkout service.
     */
    payment_gate?: number;
    /**
     * **Payment Methods for Transactions:**
     *
     * - **`cards`**: For card payments.
     * - **`abapay_khqr`**: QR payment that can be scanned and paid using ABA PAY and other KHQR
     * member banks.
     * - **`abapay_khqr_deeplink`**: Allows customers to pay using **ABA PAY** and other **KHQR
     * member banks**. The payment gateway will respond with a JSON object containing
     * `qr_string`, `abapay_deeplink`, and `checkout_qr_url`. See the sample response in the
     * response section below.
     * - **`alipay`**: Allows customers to pay using **Alipay Wallet**.
     * - **`wechat`**: Allows customers to pay using **WeChat Wallet**.
     * - **`google_pay`**: Allows customers to pay using **Google Pay Wallet**.
     *
     * If no value is provided, the payment gateway will automatically display the supported
     * payment options based on your profile, allowing the customer to choose a preferred
     * payment method.
     */
    payment_option?: string;
    /**
     * Base64-encoded JSON string representing payout details.
     *
     * **PHP Sample Code**
     * ```php
     * $payout = base64_encode(json_encode([
     * ["acc" => "000133879","amt"=> 1],
     * ["acc" => "000133880","amt" => 1]
     * ]));
     * ```
     */
    payout?: string;
    /**
     * Buyer's phone.
     */
    phone?: string;
    /**
     * Request date and time in UTC format as YYYYMMDDHHmmss.
     */
    req_time: string;
    /**
     * The deep link for redirecting to the app after a successful payment from ABA Mobile. Must
     * be base64-encoded and include both iOS and Android schemes. This field is mandatory for
     * mobile integration.
     *
     * **PHP Sample Code**
     *
     * ```php
     * $return_deeplink =base64_encode(json_encode([
     * "ios_scheme" => "DEEPLINK TO RETURN TO YOUR IOS APP",
     * "android_scheme" => "DEEPLINK TO RETURN TO YOUR ANDROID APP"
     * ]));
     * ```
     */
    return_deeplink?: string;
    /**
     * Information to include when PayWay calls your return URL after a successful payment.
     */
    return_params?: string;
    /**
     * URL to receive callbacks upon payment completion, encrypted with Base64.
     */
    return_url?: string;
    /**
     * Shipping fee.
     */
    shipping?: number;
    /**
     * Skip success page can be configure on checkout service level. We also provide option via
     * the API for you to override the setting too. If you don't pass this param, it will follow
     * the configuration on the profile level. Supported value:
     * - `0` : Don't skip success pages
     * -  `1`: Skip success page.
     *
     * Once you skipe success page, `continue_success_url` on profile level will be used to
     * redirect user to the specific location if you don't pass value of continue_success_url in
     * the request.
     */
    skip_success_page?: number;
    /**
     * A unique transaction identifier for the payment.
     */
    tran_id: string;
    /**
     * Type of the transaction, default value is `purchase`. Supported value:
     * - `pre-auth` : for pre purchase
     * - `purchase` : for full purchase
     *
     * Note: pre-auth only support ABA PAY, KHQR and Card Payment.
     */
    type?: string;
    /**
     * Defines the view type for the payment page.
     * - `hosted_view` : redirect payer to a new tab
     * - `popup` : Display as a **bottom sheet** on mobile web browsers and as a **modal popup**
     * on desktop web browsers.
     */
    view_type?: string;
    [property: string]: any;
}