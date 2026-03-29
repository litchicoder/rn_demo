import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Theme} from './src/theme';

// Import our screens
import {HomeScreen} from './src/screens/HomeScreen';
import {BridgeSpyScreen} from './src/screens/BridgeSpyScreen';
import {VDomScreen} from './src/screens/VDomScreen';
import {YogaScreen} from './src/screens/YogaScreen';
import {FabricScreen} from './src/screens/FabricScreen';

type ScreenName = 'Home' | 'BridgeSpy' | 'VDom' | 'Yoga' | 'Fabric';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');

  const navigate = (screen: ScreenName) => setCurrentScreen(screen);
  const goBackHome = () => setCurrentScreen('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen navigate={navigate} />;
      case 'BridgeSpy':
        return <BridgeSpyScreen goBack={goBackHome} />;
      case 'VDom':
        return <VDomScreen goBack={goBackHome} />;
      case 'Yoga':
        return <YogaScreen goBack={goBackHome} />;
      case 'Fabric':
        return <FabricScreen goBack={goBackHome} />;
      default:
        return <HomeScreen navigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});

export default App;
