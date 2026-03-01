import React, { useState } from 'react';
import { StyleSheet, View, Button, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function TestPaymentAPI() {
    const [paymentHtml, setPaymentHtml] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const startPayment = async () => {
        setLoading(true);
        try {
            // Replace with your local IP address for physical device testing
            const response = await fetch(`${API_URL}/payment/aba/card`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            // Format body as x-www-form-urlencoded
            const formBody = Object.keys(data.params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data.params[key])}`)
                .join('&');

            setPaymentHtml({
                uri: data.url,
                method: 'POST',
                body: formBody,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        } catch (error) {
            Alert.alert("Error", "Check if backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    if (paymentHtml) {
        return (
            <SafeAreaView style={styles.flex}>
                <WebView
                    source={paymentHtml}
                    onNavigationStateChange={(nav) => {
                        // Logic to catch return_url or cancel_url
                        if (nav.url.includes('success')) {
                            setPaymentHtml(null);
                            Alert.alert("Payment Success");
                        }
                    }}
                />
                <Button title="Close" onPress={() => setPaymentHtml(null)} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator size="large" /> : (
                <Button title="Pay Now" onPress={startPayment} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});