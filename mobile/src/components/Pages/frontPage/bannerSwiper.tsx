import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');
// const CONTAINER_WIDTH = width - 30; // Your 15px margin on each side
const CONTAINER_WIDTH = width - 30; // Your 15px margin on each side

const BannerSwiper = () => {
    const data = [
        { title: "Fresh Selection", subtitle: "Daily Arrivals", img: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { title: "Special Offers", subtitle: "Limited Time", img: "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ];

    return (
        <View style={styles.container}>
            <Swiper
                autoplay
                autoplayTimeout={3}
                height={300}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                // This creates the gap effect
                removeClippedSubviews={false} 
            >
                {data.map((item, index) => (
                    <View key={index} style={styles.slide}>
                        <ImageBackground 
                            source={{ uri: item.img }} 
                            style={styles.background} 
                            imageStyle={{ borderRadius: 10 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                ))}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CONTAINER_WIDTH,
        height: 300,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10, // This creates the 20px gap (10 left + 10 right)
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
    },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    subtitle: { color: 'white', fontSize: 16 },
    dot: { backgroundColor: 'rgba(255,255,255,0.3)', width: 8, height: 8, borderRadius: 4, margin: 3 },
    activeDot: { backgroundColor: 'white', width: 10, height: 10, borderRadius: 5, margin: 3 },
});

export default BannerSwiper;