import ConnectXMobileSdk from 'connect-x-react-native-sdk';
import { useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet } from 'react-native';

const UserInputModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    setModalVisible(false);
    // Handle form submission here
    console.log('Name:', name, 'Email:', email);
    ConnectXMobileSdk.cxTracking({
      cx_title: 'DropForm',
      cx_event: 'Submit Form',
    });
    ConnectXMobileSdk.cxIdentify({
      key: 'cx_email',
      customers: {
        // cx_userId: 'testbug1',
        cx_email: email,
        cx_Name: name,
        cx_firstName: name,
        cx_lastName: name,
        cx_mobilePhone: '0600000990',
        cx_birthDate: '1997-01-05',
        cx_gender: 'Female',
        cx_isConsent: true,
        cx_doNotContact: false,
        cx_doNotContactBu: false,
        cx_device: 'iPhone',
        cx_model: 'x86_64',
        cx_osName: 'IOS',
        registeredDate: '2025-01-01T00:00:00Z',
      },
      tracking: {
        cx_source: 'demo source',
        cx_title: 'drop form',
        cx_type: 'demo sdk type',
        cx_event: 'test identify',
        cx_value: 'test identify',
        cx_prospect: true,
        cx_timeStamp: '2025-01-01T00:00:00Z',
      },
    });
    // Reset form
    setName('');
    setEmail('');
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Button title="Drop Form" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter Your Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
              <Button
                title="Submit"
                onPress={handleSubmit}
                disabled={!name || !email}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default UserInputModal;
