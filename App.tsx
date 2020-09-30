import React from 'react';
import { View, StatusBar } from 'react-native';
import Routes from './src/routes/index';
import SignIn from './src/pages/SignIn'
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './src/hooks';
const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <AppProvider>
      <View style={{ flex: 1, backgroundColor: '#312e38' }} >
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>

)


export default App;
