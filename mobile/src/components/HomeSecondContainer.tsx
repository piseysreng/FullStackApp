import { ActivityIndicator, FlatList, KeyboardAvoidingView, ListRenderItem, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { Category } from '@/assets/TYPES'
// import { categories } from '@/assets/Categories'
import CategoryListItem from './CategoryListItem'
import { useQuery } from '@tanstack/react-query'
import { listCategories } from '../api/categories'

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

    if (isLoading) { return <ActivityIndicator /> };
    if (error) { return <Text>Error Fetching Categories</Text> };

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
            <View style={{ backgroundColor: 'lightgrey' }}>
                <Text>Search Section</Text>
                <TextInput
                    value={tempSearch}
                    onChangeText={setTempSearch}
                    placeholder="Search products..."
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                    blurOnSubmit={true}
                />
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text style={{ color: 'green' }}>Filter</Text>
                </Pressable>
            </View>
            <View>
                <Text>Banner</Text>
            </View>
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
                            {/* 3. Inner Pressable with stopPropagation so clicking inside doesn't close modal */}
                            <Pressable
                                style={styles.modalContent}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Text style={styles.modalTitle}>Filter Options</Text>

                                <Text style={styles.label}>Search Keyword</Text>
                                <TextInput
                                    
                                    value={tempSearch}
                                    onChangeText={setTempSearch}
                                    placeholder="Change your search..."
                                    returnKeyType="search"
                                    onSubmitEditing={handleSearch}
                                />

                                <Text style={styles.label}>Select Category</Text>
                                <View>
                                    <Text>Category Dropdown/Buttons</Text>
                                </View>

                                <Text style={styles.label}>Price Range</Text>
                                <View>
                                    <Text>Min Price - Max Price</Text>
                                </View>

                                <Pressable
                                    onPress={() => setIsFeatured(!isFeatured)}
                                    style={styles.checkboxRow}
                                >
                                    <Text>Featured Products Only</Text>
                                    <View style={[styles.checkbox, isFeatured && styles.checked]} />
                                </Pressable>

                                <View style={styles.modalButtons}>
                                    <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                        <Text>Cancel</Text>
                                    </Pressable>
                                    <Pressable style={styles.applyBtn} onPress={handleSearch}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Apply Filters</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Modal>
                <View>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) =>
                            <View style={{ width: '30%' }}>
                                <CategoryListItem category={item} />
                            </View>
                        }
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginRight: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end' // Modal slides from bottom
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 300
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        fontWeight: '600',
        marginTop: 15
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
    }
})