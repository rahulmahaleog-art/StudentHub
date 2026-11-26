
import React, { useEffect, useState } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Text, Card } from 'react-native-paper';

import { auth, db } from '../firebase/firebaseConfig';

import { doc, getDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('Student');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userDoc = await getDoc(
            doc(db, 'users', currentUser.uid)
          );

          if (userDoc.exists()) {
            setName(userDoc.data().name || 'Student');
          }
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>HELLO, STUDENT 👋</Text>

          <Text style={styles.name}>
            Welcome, {name}!
          </Text>

          <Text style={styles.subtitle}>
            Ready to learn something new today?
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🎓</Text>
        </View>
      </View>

      <Card style={styles.banner}>
        <Card.Content>
          <Text style={styles.bannerSmall}>
            YOUR LEARNING JOURNEY
          </Text>

          <Text style={styles.bannerTitle}>
            Learn. Explore. Achieve.
          </Text>

          <Text style={styles.bannerDescription}>
            Discover useful resources and make
            every day productive!
          </Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>
        Quick Access
      </Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('Explore')}
        >
          <Text style={styles.cardIcon}>📚</Text>
          <Text style={styles.cardTitle}>Explore</Text>
          <Text style={styles.cardDescription}>
            Discover resources
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('Saved')}
        >
          <Text style={styles.cardIcon}>🔖</Text>
          <Text style={styles.cardTitle}>Saved</Text>
          <Text style={styles.cardDescription}>
            Your favourites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardDescription}>
            Your account
          </Text>
        </TouchableOpacity>

        <View style={styles.quickCard}>
          <Text style={styles.cardIcon}>💡</Text>
          <Text style={styles.cardTitle}>Daily Tip</Text>
          <Text style={styles.cardDescription}>
            Stay curious!
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Why Student Hub?
      </Text>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>
            🚀 Everything in one place
          </Text>

          <Text style={styles.infoText}>
            Explore learning content, save useful
            resources and manage your student profile
            from one simple application.
          </Text>
        </Card.Content>
      </Card>

      <View style={{ height: 25 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 25,
    paddingTop: 40,
    paddingBottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#BFDBFE',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    marginTop: 7,
  },
  avatar: {
    width: 55,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  banner: {
    margin: 18,
    marginTop: -12,
    backgroundColor: '#1E3A8A',
    borderRadius: 15,
  },
  bannerSmall: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  bannerDescription: {
    color: '#DBEAFE',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1E293B',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
  },
  infoCard: {
    marginHorizontal: 18,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  infoText: {
    color: '#64748B',
    lineHeight: 21,
    marginTop: 10,
  },
});

export default HomeScreen;
