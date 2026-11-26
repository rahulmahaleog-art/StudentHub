
import React, { useCallback, useState } from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

import {
  Text,
  Card,
  Button,
  ActivityIndicator,
} from 'react-native-paper';

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import { useFocusEffect } from '@react-navigation/native';

import { auth, db } from '../firebase/firebaseConfig';

const SavedScreen = () => {
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved resources whenever the Saved tab is opened
  const loadSavedResources = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setSavedResources([]);
        return;
      }

      const savedRef = collection(
        db,
        'users',
        user.uid,
        'saved'
      );

      const snapshot = await getDocs(savedRef);

      const resources = snapshot.docs.map((document) => ({
        ...document.data(),
        id: Number(document.id),
      }));

      setSavedResources(resources);
    } catch (error) {
      console.log('Error fetching saved resources:', error);

      Alert.alert(
        'Error',
        'Unable to load your saved resources.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedResources();
    }, [])
  );

  // Remove a saved resource
  const removeResource = async (item) => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const resourceRef = doc(
        db,
        'users',
        user.uid,
        'saved',
        item.id.toString()
      );

      await deleteDoc(resourceRef);

      setSavedResources((previous) =>
        previous.filter((resource) => resource.id !== item.id)
      );

      Alert.alert(
        'Removed',
        'Resource removed from your Saved list.'
      );
    } catch (error) {
      console.log('Remove error:', error);

      Alert.alert(
        'Error',
        'Unable to remove this resource.'
      );
    }
  };

  const renderResource = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.resourceNumber}>
          SAVED RESOURCE #{item.id}
        </Text>

        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.description}>
          {item.body}
        </Text>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="outlined"
          icon="delete-outline"
          textColor="#DC2626"
          onPress={() => removeResource(item)}
        >
          Remove
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading saved resources...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          My Saved Resources 🔖
        </Text>

        <Text style={styles.subtitle}>
          Your favourite learning resources in one place.
        </Text>
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.count}>
          {savedResources.length} Saved Resources
        </Text>
      </View>

      <FlatList
        data={savedResources}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResource}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={loadSavedResources}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>

            <Text style={styles.emptyTitle}>
              No Saved Resources Yet
            </Text>

            <Text style={styles.emptyText}>
              Visit the Explore screen and bookmark
              resources you want to read later.
            </Text>
          </View>
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
    padding: 23,
    paddingTop: 35,
    paddingBottom: 28,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    marginTop: 8,
  },
  countContainer: {
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  count: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 13,
    borderRadius: 13,
  },
  resourceNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    lineHeight: 23,
  },
  description: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#64748B',
    marginTop: 15,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 70,
  },
  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
});

export default SavedScreen;
