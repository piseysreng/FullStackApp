import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import CryptoJS from 'crypto-js';

const MERCHANT_ID = 'ec463658';
const API_KEY = 'caf065bfd0b7bd65f1e1614eb36884ffa92d0525';
// const MERCHANT_ID = 'ec000262';
// const API_KEY = '308f1c5f450ff6d971bf8a805b4d18a6ef142464';
const API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/transaction-list-2';

export default function TransactionLogger() {
    const [loading, setLoading] = useState(false);

    const getTransactionList = async () => {
        setLoading(true);

        const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        
        // Settings
        const from_amount = "0.00";
        const to_amount = "5000.00";
        const status = ""; 
        const page = "1";
        const pagination = "20";

        /**
         * IMPORTANT: When using NULL dates to fix "Invalid Start Date", 
         * we skip from_date and to_date in the hash string.
         * Sequence: req_time + merchant_id + from_amount + to_amount + status + page + pagination
         */
        const b4hash = req_time + MERCHANT_ID + from_amount + to_amount + status + page + pagination;
        const hash = CryptoJS.HmacSHA512(b4hash, API_KEY).toString(CryptoJS.enc.Base64);

        const payload = {
            req_time,
            merchant_id: MERCHANT_ID,
            from_date: null,   // Setting to null avoids the "Invalid Date" error
            to_date: null,     // Setting to null avoids the "Invalid Date" error
            from_amount,
            to_amount,
            status: null, 
            page,
            pagination,
            hash
        };

        try {
            console.log("--- Fetching All Recent Transactions (Dates=null) ---");
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            
            // Log status and data
            if (result.status === 0 || result.status?.code === "00") {
                console.log("✅ Success!");
                console.log("Count:", result.data ? result.data.length : 0);
                console.log("Data:", JSON.stringify(result.data, null, 2));
            } else {
                console.log("❌ API Error:", result.status?.code || result.status);
                console.log("Message:", result.status?.message || result.description || result.message);
            }

        } catch (error) {
            console.error("Network Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={getTransactionList} disabled={loading}>
                <Text style={styles.text}>{loading ? "Checking..." : "Fetch All Transactions"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    button: { backgroundColor: '#005a9c', padding: 20, borderRadius: 10, width: '75%', alignItems: 'center' },
    text: { color: 'white', fontWeight: 'bold' }
});