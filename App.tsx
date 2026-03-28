import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {Theme} from './src/theme';
import {CustomButton} from './src/components/CustomButton';
import {ShowcaseCard} from './src/components/ShowcaseCard';
import {CustomInput} from './src/components/CustomInput';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const sections = [
    {id: '1', title: 'React Native Built-in Components'},
    {id: '2', title: 'Custom Defined Components'},
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>RN Component Showcase</Text>
      <Text style={styles.headerSubtitle}>Built-in & Custom Essentials</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      {renderHeader()}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BUILT-IN COMPONENTS SECTION */}
        <ShowcaseCard 
          title="Basic Components" 
          subtitle="View, Text, Image, ActivityIndicator"
        >
          <View style={styles.row}>
            <View style={[styles.box, {backgroundColor: Theme.colors.primary}]} />
            <View style={[styles.box, {backgroundColor: Theme.colors.secondary}]} />
            <View style={[styles.box, {backgroundColor: Theme.colors.error}]} />
          </View>
          <Text style={styles.bodyText}>
            This is a standard <Text style={{fontWeight: 'bold', color: Theme.colors.primary}}>Text</Text> element with nested styling.
          </Text>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Image 
            source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}} 
            style={styles.logo} 
          />
        </ShowcaseCard>

        <ShowcaseCard 
          title="Interactive & Feedback" 
          subtitle="TouchableOpacity, Switch, Modal"
        >
          <View style={styles.rowBetween}>
            <Text style={styles.bodyText}>Enable Notifications</Text>
            <Switch
              trackColor={{false: Theme.colors.border, true: Theme.colors.secondary}}
              thumbColor={isEnabled ? Theme.colors.text : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.touchable}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.touchableText}>Open Modal</Text>
          </TouchableOpacity>
        </ShowcaseCard>

        {/* CUSTOM COMPONENTS SECTION */}
        <ShowcaseCard 
          title="Custom Buttons" 
          subtitle="Refined interaction variants"
        >
          <View style={styles.buttonGrid}>
            <CustomButton title="Primary" onPress={() => Alert.alert('Primary Pressed')} />
            <CustomButton title="Secondary" variant="secondary" onPress={() => {}} />
            <CustomButton title="Outline" variant="outline" onPress={() => {}} />
            <CustomButton title="Loading" isLoading onPress={() => {}} />
          </View>
        </ShowcaseCard>

        <ShowcaseCard 
          title="Custom Inputs" 
          subtitle="Form elements with states"
        >
          <CustomInput 
            label="Email Address" 
            placeholder="example@mobile.com" 
            keyboardType="email-address"
          />
          <CustomInput 
            label="Password" 
            placeholder="Enter secure password" 
            secureTextEntry
          />
          <CustomInput 
            label="Username" 
            placeholder="Pick a unique name" 
            error="This field is required"
          />
        </ShowcaseCard>

        {/* FLATLIST REPRESENTATION */}
        <ShowcaseCard title="Data Lists" subtitle="FlatList demonstration">
          <View style={{height: 120}}>
            <FlatList
              data={[
                {key: 'Indigo'}, {key: 'Emerald'}, {key: 'Slate'}, 
                {key: 'Red'}, {key: 'Blue'}, {key: 'Purple'}
              ]}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{item.key}</Text>
                </View>
              )}
            />
          </View>
        </ShowcaseCard>
      </ScrollView>

      {/* MODAL COMPONENT */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Hello from Modal!</Text>
            <Text style={styles.modalText}>
              This is a standard React Native Modal component styled for a modern look.
            </Text>
            <CustomButton 
              title="Close Modal" 
              variant="outline"
              onPress={() => setModalVisible(false)} 
              style={{width: '100%', marginTop: 20}}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: Theme.spacing.lg,
    paddingTop: 40,
    backgroundColor: Theme.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  box: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.md,
  },
  bodyText: {
    fontSize: 15,
    color: Theme.colors.text,
    lineHeight: 22,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: Theme.spacing.sm,
  },
  touchable: {
    backgroundColor: Theme.colors.primary + '20',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    alignItems: 'center',
  },
  touchableText: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  buttonGrid: {
    gap: Theme.spacing.sm,
  },
  listItem: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    marginRight: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    width: '85%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default App;
