import React, {Fragment} from 'react';
import {SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import MainStackNavigator from './src/navigators/MainStackNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <MainStackNavigator/>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f3f3f3',
    height: '100%',
  },
});

export default App;
