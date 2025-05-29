import { useState } from 'react';
import ConnectXMobileSdk from 'connect-x-react-native-sdk';
import DeviceInfo from 'react-native-device-info';
import AppStateHandler from './app_state';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import UserInputModal from './drop_form';
import MyFormModal from './open_ticket';
import ObjectInputModal from './create_object';

const GetUnknownIdExample = () => {
  const [unknownId, setUnknownId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Call getUnknownId
  const fetchUnknownId = async () => {
    await ConnectXMobileSdk.cxTracking({
      cx_title: 'GetUnknownIdExample',
      cx_event: 'Get Unknown Id',
    });
    setIsLoading(true);
    try {
      const id = await ConnectXMobileSdk.getUnknownId();
      setUnknownId(id);
    } catch (error) {
      Alert.alert('Error', `Failed to get Unknown ID: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ConnectX SDK Example</Text>
      <Text style={styles.instructions}>
        DeviceInfo: {DeviceInfo.getApplicationName()}
      </Text>

      <AppStateHandler />

      {/* <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? 'Initializing...' : 'Initialize SDK'}
          onPress={initializeSdk}
          disabled={isLoading}
        />
      </View> */}

      <View style={{ flex: 1 }}>
        <UserInputModal />
        <MyFormModal />
        <ObjectInputModal />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Get Unknown ID" onPress={fetchUnknownId} />
      </View>

      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}

      {unknownId && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Your Unknown ID:</Text>
          <Text style={styles.resultValue}>{unknownId}</Text>
          <Text style={styles.note}>
            {unknownId.startsWith('uuid:')
              ? '(Fallback UUID)'
              : '(From server)'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  loader: {
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0e3eb',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  resultValue: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginBottom: 5,
    color: '#16a085',
  },
  note: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  instructions: {
    marginTop: 30,
    textAlign: 'center',
    color: '#7f8c8d',
  },
});

export default GetUnknownIdExample;
