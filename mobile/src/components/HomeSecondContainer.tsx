import { ActivityIndicator, Dimensions, FlatList, KeyboardAvoidingView, ListRenderItem, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import CategoryListItem from './CategoryListItem'
import { useQuery } from '@tanstack/react-query'
import { listCategories } from '../api/categories'
import SearchIcon from './icons/searchIcon'
import FilterIcon from './icons/filterIcon'
import BannerSwiper from './Pages/frontPage/bannerSwiper'
import BannerSection from './Pages/frontPage/bannerSection'

const { width } = Dimensions.get('window');

export default function HomeSecondContainer() {
    const [tempSearch, setTempSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    // Filter States
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState(''); // e.g., 'low-to-high'
    const [isFeatured, setIsFeatured] = useState(false);
    const router = useRouter();

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: listCategories
    });

    // if (isLoading) { return <ActivityIndicator /> };
    // if (error) { return <Text>Error Fetching Categories</Text> };

    const handleSearch = () => {
        if (tempSearch.trim().length > 0 || selectedCategory || isFeatured) {
            setModalVisible(false); // Close modal if searching from inside it
            router.push({
                pathname: '/(protected)/search',
                params: {
                    q: tempSearch,
                    category: selectedCategory,
                    featured: isFeatured ? 'true' : 'false'
                }
            });
        }
    };
    return (
        <View>

            <View style={styles.searchContainer}>
                <View style={styles.searchContainerLeft}>
                    <View>
                        <SearchIcon color={"#868889"} width={25} height={25} />
                    </View>
                    <TextInput
                        value={tempSearch}
                        onChangeText={setTempSearch}
                        autoCorrect={false}
                        placeholder="Search keywords..."
                        // returnKeyType="search"
                        onSubmitEditing={handleSearch}
                        blurOnSubmit={true}
                        style={styles.keywordTextInput}
                        placeholderTextColor={"#868889"}
                    />
                </View>
                <View style={styles.filterButton}>
                    <Pressable onPress={() => setModalVisible(true)}>
                        <FilterIcon color={"#868889"} width={25} height={25} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.bannerWrapper}>
                <BannerSection />
            </View>
            <View style={{ paddingTop: 2000 }}></View>
            <View style={{ paddingTop: 30 }} />
            <View>
                <View>
                    <Text>Category</Text>
                    <Link href='/(protected)/category'>
                        <Text style={{ color: 'orange', }}>View All Category</Text>
                    </Link>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    {/* 1. Use KeyboardAvoidingView to push content up when keyboard opens */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        {/* 2. Outer Pressable to close modal when clicking the dimmed background */}
                        <Pressable
                            style={styles.modalOverlay}
                            onPress={() => setModalVisible(false)}
                        >
                            {/* <LinearGradient
                                // Adjust these colors to your liking
                                // Top is transparent, bottom is 80% black opacity
                                colors={['#4c669f', '#3b5998']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            // style={StyleSheet.absoluteFillObject} // Fills the Pressable completely
                            /> */}
                            {/* 3. Inner Pressable with stopPropagation so clicking inside doesn't close modal */}
                            <Pressable
                                style={styles.modalContent}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Text style={styles.modalTitle}>Filter Options</Text>

                                <Text style={styles.label}>Keywords</Text>
                                <TextInput
                                    value={tempSearch}
                                    onChangeText={setTempSearch}
                                    placeholder="Search keywords..."
                                    returnKeyType="search"
                                    onSubmitEditing={handleSearch}
                                    style={styles.textInputModal}
                                    placeholderTextColor={"#868889"}
                                />

                                <Text style={styles.label}>Select Category</Text>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }}>Category Dropdown/Buttons</Text>
                                </View>

                                <Text style={styles.label}>Price Range</Text>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }}>Min Price - Max Price</Text>
                                </View>

                                <Pressable
                                    onPress={() => setIsFeatured(!isFeatured)}
                                    style={styles.checkboxRow}
                                >
                                    <Text style={{ fontFamily: 'Poppins_400Regular' }}>Featured Products Only</Text>
                                    <View style={[styles.checkbox, isFeatured && styles.checked]} />
                                </Pressable>

                                <View style={styles.modalButtons}>
                                    <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                        <Text style={{ fontFamily: 'Poppins_500Medium' }}>Cancel</Text>
                                    </Pressable>
                                    <Pressable style={styles.applyBtn} onPress={handleSearch}>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins_500Medium' }}>Apply Filters</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Modal>
                <View>
                    {/* MOVE LOADING LOGIC HERE */}
                    {isLoading ? (
                        <ActivityIndicator size="small" color="green" />
                    ) : error ? (
                        <Text>Error Fetching Categories</Text>
                    ) : (
                        <FlatList
                            data={categories}
                            renderItem={({ item }) => (
                                <View style={{ width: 100 }}>
                                    <CategoryListItem category={item} />
                                </View>
                            )}
                            horizontal
                            keyExtractor={item => item.id.toString()}
                            style={{ paddingVertical: 10 }}
                        />
                    )}
                    {/* <FlatList
                        data={categories}
                        renderItem={({ item }) =>
                            <View style={{ width: '30%' }}>
                                <CategoryListItem category={item} />
                            </View>
                        }
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                    /> */}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#F4F5F9',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 10,
        height: 55,
    },
    searchContainerLeft: {
        flex: 1, // This is what "fixes" the filter icon to the right
        flexDirection: 'row',
        alignItems: 'center',
    },
    keywordTextInput: {
        flex: 1, // This fills the space between the SearchIcon and the FilterIcon
        height: '100%',
        marginLeft: 10, // Gap between Search Icon and Text
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#333',
        // backgroundColor: 'orange',
        marginRight: 10
    },
    filterButton: {
        // paddingLeft: 10, // A small fixed gap so the text doesn't hit the icon
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        borderRadius: 8,
        padding: 10,
        marginRight: 0
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'flex-end' // Modal slides from bottom
    },
    modalContent: {
        backgroundColor: '#F2FFE6',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 300
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Poppins_700Bold',
    },
    label: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        fontWeight: '600',
        marginTop: 30,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'grey',
        marginBottom: 5
    },
    textInputModal: {
        color: 'black',
        fontFamily: 'Poppins_500Medium',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30
    },
    applyBtn: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center'
    },
    cancelBtn: {
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center'
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    checked: {
        backgroundColor: 'green'
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    bannerWrapper: {
        marginVertical: 10,
        width: width,
        alignItems: 'center',
        marginLeft: -15,
        flex: 1
    },
})