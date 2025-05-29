import ConnectXMobileSdk from 'connect-x-react-native-sdk';
import { useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet } from 'react-native';

const ObjectInputModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [object, setObject] = useState('');
  const [name, setName] = useState('');
  const [docId, setDocId] = useState('');

  const showModal = () => {
    setModalVisible(true);
    ConnectXMobileSdk.cxTracking({
      cx_title: 'Open Create Record Modal',
      cx_event: 'Open Create Record Modal',
    });
  };

  const handleSubmit = () => {
    setModalVisible(false);
    // Handle form submission
    const formData = {
      object: object.trim(),
      name: name.trim(),
      docId: docId.trim(),
    };
    console.log('Form Data:', formData);
    ConnectXMobileSdk.cxTracking({
      cx_title: 'Submit Create Record',
      cx_event: 'Create Record',
    });
    ConnectXMobileSdk.cxCreateRecords(object, [
      {
        attributes: { referenceId: 'www1' },
        cx_Name: name,
        docId: docId,
      },
    ]);
    // Reset form
    setObject('');
    setName('');
    setDocId('');
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Button title="Create Record" onPress={() => showModal()} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter Document Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Object"
              placeholderTextColor="gray"
              value={object}
              onChangeText={setObject}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="DocID"
              placeholderTextColor="gray"
              value={docId}
              onChangeText={setDocId}
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  ConnectXMobileSdk.cxTracking({
                    cx_title: 'Cancel Create Record',
                    cx_event: 'Cancel Create Record',
                  });
                }}
                color="#6c757d"
              />
              <Button
                title="Submit"
                onPress={handleSubmit}
                disabled={!object || !name}
                color="#28a745"
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
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    width: '90%',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
});

export default ObjectInputModal;
