
import React, { useEffect } from 'react';

import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#2563EB"
        barStyle="light-content"
      />

      <View style={styles.logo}>
        <Text style={styles.logoText}>🎓</Text>
      </View>

      <Text style={styles.title}>
        Student Hub
      </Text>

      <Text style={styles.subtitle}>
        Learn  •  Explore  •  Achieve
      </Text>

      <View style={styles.bottom}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />

        <Text style={styles.loadingText}>
          Loading your learning journey...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 125,
    height: 125,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  logoText: {
    fontSize: 75,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 15,
    color: '#DBEAFE',
    marginTop: 10,
    letterSpacing: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 65,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 13,
  },
});

export default SplashScreen;
