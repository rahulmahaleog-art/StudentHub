
import React, { useEffect, useState } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';

import { signOut } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';

const ProfileScreen = () => {
  const [name, setName] = useState('Student');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch student details from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          setEmail(user.email || '');

          const userRef = doc(db, 'users', user.uid);

          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            setName(userData.name || 'Student');
          }
        }
      } catch (error) {
        console.log('Profile fetch error:', error);

        Alert.alert(
          'Error',
          'Unable to load profile information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Firebase logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);

              await signOut(auth);

              // AppNavigator automatically redirects
              // the user to the Login screen.

            } catch (error) {
              console.log('Logout error:', error);

              Alert.alert(
                'Error',
                'Unable to logout. Please try again.'
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          My Profile
        </Text>

        <Text style={styles.subtitle}>
          Manage your Student Hub account
        </Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🎓</Text>
        </View>

        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

        <View style={styles.memberBadge}>
          <Text style={styles.memberText}>
            Student Hub Member
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Account Information
      </Text>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>

            <View style={styles.infoDetails}>
              <Text style={styles.label}>
                Full Name
              </Text>

              <Text style={styles.value}>
                {name}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📧</Text>

            <View style={styles.infoDetails}>
              <Text style={styles.label}>
                Email Address
              </Text>

              <Text style={styles.value}>
                {email}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🎓</Text>

            <View style={styles.infoDetails}>
              <Text style={styles.label}>
                Account Type
              </Text>

              <Text style={styles.value}>
                Student
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>
        Application Information
      </Text>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📱</Text>

            <View style={styles.infoDetails}>
              <Text style={styles.label}>
                Application Name
              </Text>

              <Text style={styles.value}>
                Student Hub
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⚙️</Text>

            <View style={styles.infoDetails}>
              <Text style={styles.label}>
                Version
              </Text>

              <Text style={styles.value}>
                1.0.0
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="logout"
        buttonColor="#DC2626"
        textColor="#FFFFFF"
        loading={loggingOut}
        disabled={loggingOut}
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.logoutContent}
      >
        Logout
      </Button>

      <Text style={styles.footer}>
        Thank you for using Student Hub! ❤️
      </Text>

      <View style={{ height: 30 }} />
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
    padding: 23,
    paddingTop: 35,
    paddingBottom: 28,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    marginTop: 7,
  },
  profileSection: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 55,
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },
  memberBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 13,
  },
  memberText: {
    color: '#1D4ED8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 10,
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoIcon: {
    fontSize: 25,
    marginRight: 15,
  },
  infoDetails: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
  },
  divider: {
    backgroundColor: '#E2E8F0',
  },
  logoutButton: {
    marginHorizontal: 18,
    marginTop: 28,
    borderRadius: 9,
  },
  logoutContent: {
    height: 48,
  },
  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
  },
});

export default ProfileScreen;
