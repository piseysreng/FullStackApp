import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { categoryData } from '../../../assets/CATEGORY';
import Colors from '../../components/colorCode';
import { SearchIcon } from '../../components/tabIcons';
import { Link } from 'expo-router';

export default function HomeSecondContainer() {
  const [selectedId, setSelectedId] = useState(null);

  // const filterButtonClick = (id: number) => {
  //   if (id !== selectedId) {
  //     setSelectedId(id);
  //     console.log(`Filter Button Clicked; ID: ${id}`);
  //   }
  // };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <Link asChild href={`/category/${item.id}`} style={[styles.itemFilter, isSelected ? styles.activeItemFilter : styles.inactiveItemFilter]}>
        <TouchableOpacity>
          <Text style={isSelected ? styles.activeTextFilter : styles.inactiveTextFilter}>
            {item.category}
          </Text>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.secondContainer}>
      <View style={styles.topContainer}>
        <View style={styles.topContainerLeft}>
          <Text style={styles.topContainerLeftTitle}>Daily{'\n'}Grocery Food</Text>
        </View>
        <View style={styles.topContainerRight}>
          <Pressable
            style={({ pressed }) => [styles.button, { backgroundColor: pressed ? '#f1f1f1ff' : '#ffffffff', },]}
            onPress={() => { console.log('Search Click') }}>
            <SearchIcon color={Colors.primary} width={25} height={25} />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={categoryData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.productContainerTop}>
        <Text style={styles.productContainerTopTitle}>Popular Fruits</Text>
        <TouchableOpacity >
          <Text style={styles.productContainerTopButton}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  topContainerLeft: {
    width: '80%'
  },
  topContainerLeftTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary
  },
  topContainerRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondContainer: {
    paddingVertical: 30
  },
  itemFilter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 13,
    borderRadius: 30,
  },
  inactiveItemFilter: {
    backgroundColor: '#f3f3f3ff',
  },
  activeItemFilter: {
    backgroundColor: Colors.primary,
  },
  inactiveTextFilter: {
    color: Colors.primary,
    fontWeight: '500'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 50,
    elevation: 3,
    borderWidth: 1,
    height: 80,
    borderColor: '#ede9e9ff',
  },
  activeTextFilter: {
    color: 'white',
    fontWeight: '500'
  },
  productContainerTop: {
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productContainerTopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary
  },
  productContainerTopButton: {
    color: Colors.textGrey
  },
})