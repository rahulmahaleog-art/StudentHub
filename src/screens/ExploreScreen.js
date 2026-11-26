
import React, { useEffect, useState } from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';

import {
  Text,
  Card,
  Searchbar,
  ActivityIndicator,
  Button,
  Chip,
} from 'react-native-paper';

import { fetchPosts } from '../services/api';

import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';

const ExploreScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState([]);

  // Fetch posts from external API
  const loadPosts = async () => {
    try {
      setError('');

      const data = await fetchPosts();

      setPosts(data);
    } catch (err) {
      setError(
        'Unable to load resources. Please check your internet connection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch already saved resource IDs from Firestore
  const loadSavedIds = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const savedRef = collection(
        db,
        'users',
        user.uid,
        'saved'
      );

      const snapshot = await getDocs(savedRef);

      setSavedIds(
        snapshot.docs.map((document) => Number(document.id))
      );
    } catch (err) {
      console.log('Error loading saved IDs:', err);
    }
  };

  useEffect(() => {
    loadPosts();
    loadSavedIds();
  }, []);

  // Save or remove a resource
  const toggleBookmark = async (item) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Login Required', 'Please login first.');
        return;
      }

      const resourceRef = doc(
        db,
        'users',
        user.uid,
        'saved',
        item.id.toString()
      );

      if (savedIds.includes(item.id)) {
        await deleteDoc(resourceRef);

        setSavedIds((previous) =>
          previous.filter((id) => id !== item.id)
        );

        Alert.alert('Removed', 'Resource removed from Saved.');
      } else {
        await setDoc(resourceRef, {
          id: item.id,
          userId: item.userId,
          title: item.title,
          body: item.body,
          savedAt: new Date().toISOString(),
        });

        setSavedIds((previous) => [...previous, item.id]);

        Alert.alert('Saved!', 'Resource added to your Saved list.');
      }
    } catch (err) {
      console.log('Bookmark error:', err);

      Alert.alert(
        'Error',
        'Unable to update saved resources. Please try again.'
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
    loadSavedIds();
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.body.toLowerCase().includes(search.toLowerCase())
  );

  const renderPost = ({ item }) => {
    const isSaved = savedIds.includes(item.id);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Chip
              compact
              style={styles.category}
              textStyle={styles.categoryText}
            >
              RESOURCE #{item.id}
            </Chip>

            <Text style={styles.user}>
              Student {item.userId}
            </Text>
          </View>

          <Text style={styles.postTitle}>
            {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
          </Text>

          <Text style={styles.postBody}>
            {item.body}
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button
            mode="text"
            icon={isSaved ? 'bookmark' : 'bookmark-outline'}
            textColor={isSaved ? '#2563EB' : '#64748B'}
            onPress={() => toggleBookmark(item)}
          >
            {isSaved ? 'Saved' : 'Save Resource'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          animating={true}
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading resources...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Button
          mode="contained"
          onPress={loadPosts}
          style={styles.retryButton}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Explore Resources 📚
        </Text>

        <Text style={styles.subtitle}>
          Discover something new every day!
        </Text>
      </View>

      <Searchbar
        placeholder="Search resources..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>
          Available Resources
        </Text>

        <Text style={styles.count}>
          {filteredPosts.length} items
        </Text>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563EB']}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No resources found.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 22,
    paddingTop: 30,
    paddingBottom: 28,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#DBEAFE',
    marginTop: 8,
  },
  search: {
    marginHorizontal: 16,
    marginTop: -12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  count: {
    fontSize: 12,
    color: '#64748B',
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 13,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    backgroundColor: '#DBEAFE',
  },
  categoryText: {
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  user: {
    fontSize: 11,
    color: '#64748B',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    lineHeight: 23,
  },
  postBody: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 21,
    marginTop: 9,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 15,
    color: '#64748B',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 14,
  },
  retryButton: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 35,
  },
});

export default ExploreScreen;
