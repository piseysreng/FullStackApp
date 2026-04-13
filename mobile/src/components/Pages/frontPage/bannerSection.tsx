import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    interpolate, 
    interpolateColor, // Add this for color transition
    Extrapolate, 
    SharedValue
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTAINER_WIDTH = SCREEN_WIDTH;
const BANNER_HEIGHT = (CONTAINER_WIDTH * 4) / 6;
const GAP = 30; 

interface PaginationItemProps {
    index: number;
    animValue: SharedValue<number>;
    length: number;
}

// --- 1. Custom Pagination Item Component ---
const PaginationItem: React.FC<PaginationItemProps>  = ({ index, animValue, length }) => {
    const animStyle = useAnimatedStyle(() => {
        const progress = animValue.value % length;
        let distance = Math.abs(progress - index);

        if (distance > length / 2) {
            distance = length - distance;
        }

        const width = interpolate(
            distance,
            [0, 1],
            [22, 8], 
            Extrapolate.CLAMP
        );

        // Transition from Orange (active) to White with 0.3 opacity (inactive)
        const backgroundColor = interpolateColor(
            distance,
            [0, 1],
            [
                'rgba(108, 197, 29, 0.9)',   // Active: Orange with 0.9 opacity
                'rgba(255, 255, 255, 0.8)'  // Inactive: White with 0.8 opacity
            ]
        );

        return {
            width,
            backgroundColor,
        };
    });

    return (
        <Animated.View
            style={[
                styles.dotBase,
                animStyle,
            ]}
        />
    );
};

// --- 2. Main Banner Section Component ---
const BannerSection = () => {
    const progressValue = useSharedValue(0);
    const data = [
        { title: "Fresh Selection", subtitle: "Daily Arrivals", img: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { title: "Special Offers", subtitle: "Limited Time", img: "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { title: "Organic Green", subtitle: "Premium Quality", img: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ];

    return (
        <View style={styles.mainContainer}>
            <Carousel
                loop
                autoPlay={true}
                autoPlayInterval={3000}
                width={CONTAINER_WIDTH}
                height={BANNER_HEIGHT}
                data={data}
                onProgressChange={(_, absoluteProgress) => {
                    progressValue.value = absoluteProgress;
                }}
                renderItem={({ item }) => (
                    <View style={styles.itemWrapper}>
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
                )}
            />

            <View style={styles.paginationContainer}>
                {data.map((_, index) => (
                    <PaginationItem
                        key={index}
                        index={index}
                        animValue={progressValue}
                        length={data.length}
                    />
                ))}
            </View>
        </View>
    );
}

export default BannerSection;

const styles = StyleSheet.create({
    mainContainer: {
        height: BANNER_HEIGHT,
        width: CONTAINER_WIDTH,
    },
    itemWrapper: {
        width: CONTAINER_WIDTH,
        height: BANNER_HEIGHT,
        paddingHorizontal: GAP / 2,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 10,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Poppins_700Bold'
    },
    subtitle: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins_400Regular'
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 15,
        left: 25,
        zIndex: 10,
        alignItems: 'center',
    },
    dotBase: {
        height: 8,
        borderRadius: 5,
        marginHorizontal: 3,
    }
});