# connect-x-react-native-sdk

for Connect X Tracking

The **ConnectX React Native SDK** is a React Native library designed to simplify the integration of ConnectX's tracking and data management features into your mobile applications. It provides functionalities for tracking events, managing user data, and interacting with backend APIs, ensuring seamless user analytics and experience tracking.

---

## Features

- **User Event Tracking**: Track user actions, behaviors, and interactions within your app.
- **Create Customer**: Identify and manage user details across sessions.
- **Open Ticket**: Open support tickets programmatically.
- **Create or Update Custom Records**: Create and edit records in bulk.
- **Get Unknown ID**: Generates and returns a unique identifier.

---
## Getting started
- A valid **ConnectX API Token** and **Organize ID** are required for initialization.

## Installation

```sh
npm install connect-x-react-native-sdk
```

## Usage

### 1. Import the Library

```js
import ConnectXMobileSdk from 'connect-x-react-native-sdk';

```
### 2. Initialize the SDK

Before using any SDK methods, initialize it with your token and organize ID.
Note: You can generate the YOUR_API_TOKEN from [Connect-X](https://app.connect-x.tech/) by navigating to:
Organization Settings → SDK Tracking.

// index.js
```js
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import ConnectXMobileSdk from 'connect-x-react-native-sdk';
ConnectXMobileSdk.initialize(
  'YOUR_TOKEN',
  'YOUR_ORGANIZE_ID'
  env='YOUR_ENV' //optional
);

AppRegistry.registerComponent(appName, () => App);

```

### 3. Track Events

```js
import ConnectXMobileSdk from 'connect-x-react-native-sdk';

await ConnectXMobileSdk.cxTracking({
  cx_title: 'YOUR_TRACKING_NAME',
  cx_event: 'YOUR_EVENT',
  cx_source: 'YOUR_SOURCE',
  // other Activity field
});
```

### 4. Create Customer

```js
import ConnectXMobileSdk from 'connect-x-react-native-sdk';

await ConnectXMobileSdk.cxIdentify(
  {
    key: 'cx_email',
    customers: { // The value for the Customer object.
      cx_Name: 'customerName',
      cx_firstName: 'customerFirstName',
      cx_mobilePhone: '0000000000',
      cx_email: 'customerEmail'
      //... Other Customer Field
    },
    // Optional
    tracking: { // The value for the Activities object.
      cx_value: '',
      cx_tag: ['Keyword1', 'Keyword2', 'Keyword3'],
      cx_prospect: true
      // ... Other Activity Field
    },
    // Optional
    form: { // The value for the Form object.
      cx_subject: 'mobile',
      cx_desc: 'mobile'
      // ... Other Form Field.
    },
    // Optional
    options:  {
      updateCustomer: false, // Enable/Disable Customer Data Update
      customs: [
        //For adding values in the Object that you want to reference with the Customer Object.
        {
          customObjectA: {cx_Name: 'Keyword'},
        },
        {
          customObjectB: {cx_Name: 'Keyword'},
        }
      ],
      updateSomeFields: {
        // For adding cases where you want to update some values in the Customers Object.
        bmi: 25,
        weight: 55
      }
    }
 }
);
```

### 5. Open Tickets

```js
import ConnectXMobileSdk from 'connect-x-react-native-sdk';

await ConnectXMobileSdk.cxOpenTicket({
  key: 'cx_Name',
  customers: {
    cx_Name: 'customerName',
    cx_firstName: 'customerFirstName',
    cx_phone: 'customerPhone',
    cx_mobilePhone: 'customerMobilePhone',
    cx_email: 'customerEmail',
  },
  ticket: {
    cx_subject: 'test subject',
    cx_socialAccountName: 'xxxx@hotmail.com',
    cx_socialContact: 'xxxx@hotmail.com',
    cx_channel: 'email',
    email: {
      text: 'text',
      html: '<b>Content</b>',
    },
  },
  lead: {
    cx_email: 'xxxx@hotmail.com',
    cx_channel: 'test_connect_email',
  },
  customs: [
    {
      customObjectA: {'cx_Name': 'Test'},
    },
    {
      customObjectB: {'cx_Name': 'Test'},
    }
  ]
});
```

### 6. Create or Update Custom Objects

To create a new custom object, you must generate a unique referenceId to identify the record. If you pass a docId, the object is updated instead of being created.

```js
import ConnectXMobileSdk from 'connect-x-react-native-sdk';

var result = await ConnectXMobileSdk.cxCreateRecords(object, [ // limit 200 rows
  {
    attributes: { referenceId: 'UNIQUE_ID' }, // Replace with your unique ID generation logic
    cx_Name: name,
    docId: docId, // Pass null for create mode; pass a valid ID for edit mode
  },
]);
console.log('Create Record Response:', result);
```

### 7. Get Unknown ID

This method generates and returns a unique identifier.

```js
import ConnectXMobileSdk from 'connect-x-react-native-sdk';

const unknownId = await ConnectXMobileSdk.getUnknownId();
```

## License

[![Apache License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

