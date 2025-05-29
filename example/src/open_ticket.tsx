// import ConnectXMobileSdk from 'connect-x-react-native-sdk';
import { ConnectXMobileSdk } from 'connect-x-react-native-sdk';
import { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const MyFormModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [content, setContent] = useState('');

  const showModal = () => {
    setModalVisible(true);
    ConnectXMobileSdk.cxTracking({
      cx_title: 'Open Ticket Modal',
      cx_event: 'Open Ticket Modal',
    });
  };

  const handleSubmit = () => {
    ConnectXMobileSdk.cxTracking({
      cx_title: 'Submit Ticket',
      cx_event: 'Submit Ticket',
    });
    console.log('Submit:', { name, email1, email2, content });
    ConnectXMobileSdk.cxOpenTicket({
      key: 'cx_Name',
      customers: {
        cx_Name: name,
        cx_firstName: name,
        cx_phone: '0000000000',
        cx_mobilePhone: '0000000000',
        cx_email: email2,
      },
      ticket: {
        cx_subject: 'test email',
        cx_socialAccountName: email1, //manow.seem2@gmail.com
        cx_socialContact: email2,
        cx_channel: 'email',
        // 'cx_subject': 'test',
        email: { text: 'from mobile app', html: `<b>${content}</b>` },
      },
      lead: {
        cx_email: 'xxxx@hotmail.com',
        cx_channel: 'test_connect_email',
      },
      customs: [
        {
          customObjectA: { cx_Name: 'Test' },
        },
        {
          customObjectB: { cx_Name: 'Test' },
        },
      ],
    });
    setModalVisible(false);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Button title="Open Ticket" onPress={() => showModal()} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Contact Form</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Connector email"
              placeholderTextColor="gray"
              value={email1}
              onChangeText={setEmail1}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Customer email"
              placeholderTextColor="gray"
              value={email2}
              onChangeText={setEmail2}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Enter your message or content"
              placeholderTextColor="gray"
              value={content}
              onChangeText={setContent}
              multiline
            />

            <Button title="Submit" onPress={handleSubmit} />
            <View style={{ marginVertical: 8 }} />

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                ConnectXMobileSdk.cxTracking({
                  cx_title: 'Close Ticket Modal',
                  cx_event: 'Close Ticket Modal',
                });
              }}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  closeText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default MyFormModal;
