import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

import logo from './assets/mxball.png'; 
import backgroundImage from './assets/fondopkmn.jpg';

function Content() {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=52`);
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
              const data = await response.json();

              const pokemonRequests = data.results.map(async pokemon => {
                  const pokemonResponse = await fetch(pokemon.url);
                  return pokemonResponse.json();
              });
              const pokemonData = await Promise.all(pokemonRequests);

              setItems(pokemonData);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching Pokemon:', error);
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredResults = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchTerm, items]);

  const handleSearch = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  if (isLoading) {
      return (
          <View style={styles.container}>
              <Text>Loading...</Text>
          </View>
      );
  }

  return (
      <View style={styles.container}>
          <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
          />
          <FlatList
              data={searchTerm.trim() === '' ? items : searchResults}
              renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                      <Image
                          source={{ uri: item.sprites.versions["generation-v"]["black-white"].front_default }}
                          style={styles.itemImage}
                      />
                      <Text style={styles.itemName}>{item.name}</Text>
                  </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContainer}
          />
      </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.navbarTitle}>Poketzal</Text>
      </View>

      <Content />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8E8E8E',
    opacity: 0.9,
  },
  navbar: {
    height: 60,
    backgroundColor:'#008316', 
    border: "4px solid #C40000",
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10, 
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    height: 30,
    margin:20,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    borderRadius: 20,
    border: "3px solid #000000",
  },
  searchButton: {
    backgroundColor: '#CC4747',
    border: "3px solid #FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
      paddingHorizontal: 10,
      paddingTop: 10,
  },
  itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      padding: 10,
  },
  itemImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
  },
  itemName: {
      fontSize: 18,
      fontWeight: 'bold',
  },
});
