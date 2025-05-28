import { Platform, NativeModules } from 'react-native';
import axios, { type AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import DeviceInfo from 'react-native-device-info';
// import { useNetInfo } from '@react-native-community/netinfo';

class ConnectXMobileSdk {
  private static instance: ConnectXMobileSdk;
  private token: string = '';
  private axiosInstance: AxiosInstance;
  private appStartTime: Date = new Date();
  private userAgent: string = '';
  private cookie: string = '';
  private organizeId: string = '';
  // private deviceType: string = '';
  private domainPrefix: string = 'backend';
  // private netInfo = useNetInfo();

  private get apiDomain(): string {
    return `https://${this.domainPrefix}.connect-x.tech/connectx/api`;
  }

  private get generateCookieUrl(): string {
    return `https://${this.domainPrefix}.connect-x.tech/connectx/api/webtracking/generateCookie`;
  }

  private constructor() {
    this.axiosInstance = axios.create();
    this.setupInterceptors();
  }

  public static getInstance(): ConnectXMobileSdk {
    if (!ConnectXMobileSdk.instance) {
      ConnectXMobileSdk.instance = new ConnectXMobileSdk();
    }
    return ConnectXMobileSdk.instance;
  }

  public static async initialize(
    token: string,
    organizeId: string,
    env?: string
  ): Promise<void> {
    const instance = ConnectXMobileSdk.getInstance();

    if (!token) {
      throw new Error('Token must not be empty.');
    }
    if (!organizeId) {
      throw new Error('Organize ID must not be empty.');
    }

    if (env) {
      instance.domainPrefix = `backend-${env}`;
    }

    instance.token = token;
    instance.organizeId = organizeId;

    // Set up user agent
    const appName = DeviceInfo.getApplicationName();
    const appVersion = DeviceInfo.getVersion();
    // const appName = '';
    // const appVersion = '';
    const systemName = Platform.OS;
    const systemVersion = Platform.Version;
    instance.userAgent = `${appName}/${appVersion} (${systemName}; ${systemVersion})`;

    console.log(`User Agent: ${instance.userAgent}`);
    // Initialize cookie
    instance.cookie = await ConnectXMobileSdk.getUnknownId();
    // instance.deviceType = instance.getDeviceType();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(async (config) => {
      // Add auth token to all requests
      config.headers.Authorization = `Bearer ${this.token}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    });
  }

  private getDeviceLanguage = () => {
    let locale;

    if (Platform.OS === 'ios') {
      // For iOS
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages[0];
    } else {
      // For Android
      locale = NativeModules.I18nManager?.localeIdentifier;
    }

    return locale?.split('_')[0]?.split('-')[0] || 'en';
  };

  private async getClientData(): Promise<Record<string, any>> {
    // var network = '';
    // ConnectXReactNativeSdk.getNetworkType()
    //   .then((type) => (network = type))
    //   .catch((err) => console.error('❌ Error:', err));
    const locale = this.getDeviceLanguage();
    // const language = locales[0]?.languageCode || 'en';
    // const language = 'en';
    const appName = DeviceInfo.getApplicationName();
    const appVersion = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    const uniqueId = await DeviceInfo.getUniqueId();
    const deviceId = DeviceInfo.getDeviceId();
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const systemVersion = DeviceInfo.getSystemVersion();
    const isTablet = DeviceInfo.isTablet();

    const clientData: Record<string, any> = {
      cx_isBrowser: false,
      cx_language: locale,
      cx_browserName: '',
      cx_browserVersion: '',
      cx_engineName: 'React Native',
      cx_engineVersion: '0.79.2',
      cx_userAgent: this.userAgent,
      cx_source: appName,
      cx_type: 'Mobile App',
      cx_deviceType: isTablet ? 'Tablet' : 'Mobile',
      cx_networkType: '',
      cx_appVersion: appVersion,
      cx_appBuild: buildNumber,
      cx_libraryVersion: '1.0.0',
      cx_libraryPlatform: 'React Native',
      cx_deviceId: uniqueId,
      cx_fingerprint: deviceId,
      cx_os: Platform.OS === 'ios' ? 'iOS' : 'Android',
      cx_osVersion: systemVersion,
      cx_device: model,
      cx_deviceManufacturer: brand,
    };

    return clientData;
  }

  // private getNetworkType = async () => {
  //   if (Platform.OS === 'android') {
  //     return await NativeModules.ConnectXReactNativeSdk.getNetworkType();
  //   } else if (Platform.OS === 'ios') {
  //     return await NativeModules.NetworkType.getNetworkType();
  //   }
  //   return 'unknown';
  // };

  // private getDeviceType(): string {
  //   const { width } = Dimensions.get('window');
  //   if (Platform.OS === 'android' || Platform.OS === 'ios') {
  //     return width < 600 ? 'Mobile' : 'Tablet';
  //   }
  //   return 'Unknown';
  // }

  public static async getUnknownId(): Promise<string> {
    const instance = ConnectXMobileSdk.getInstance();
    try {
      const response = await instance.axiosInstance.get(
        instance.generateCookieUrl
      );
      return response.data;
    } catch (error) {
      console.error('Failed to set cookies:', error);
      return uuidv4(); // Fallback to random UUID
    }
  }

  private async getTrackingData(): Promise<Record<string, any>> {
    const clientData = await this.getClientData();
    return {
      cx_cookie: this.cookie,
      cx_timespent: Math.floor(
        (new Date().getTime() - this.appStartTime.getTime()) / 1000
      ),
      ...clientData,
    };
  }

  private async cxPost(endpoint: string, data: any): Promise<void> {
    console.log('cxPost data:', data);
    console.log('cxPost endpoint:', `${this.apiDomain}${endpoint}`);
    await this.axiosInstance
      .post(`${this.apiDomain}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
      })
      .then((response) => {
        console.log('Response:', response.data);
        if (response.status === 200) {
          console.log('Request was successful');
        } else {
          console.log('Request was not successful:', response.status);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The server responded with a status outside 2xx
          console.log('Status:', error.response.status);
          console.log('Message:', error.response.data.message); // or error.response.data
        } else if (error.request) {
          // Request was made but no response received
          console.log('No response:', error.request);
        } else {
          // Something else happened while setting up the request
          console.log('Error:', error.message);
        }
      });
  }

  // Public API Methods

  public static async cxTracking(body: Record<string, any>): Promise<boolean> {
    const instance = ConnectXMobileSdk.getInstance();
    try {
      await instance.cxPost('/webtracking', {
        ...(await instance.getTrackingData()),
        ...body,
        organizeId: instance.organizeId,
      });
      return true;
    } catch (error) {
      console.error('Error in cxTracking:', error);
      throw error;
    }
  }

  public static async cxIdentify(data: Record<string, any>): Promise<boolean> {
    const instance = ConnectXMobileSdk.getInstance();
    try {
      await instance.cxPost('/webtracking/dropform', {
        key: data.key,
        customers: data.customers,
        tracking: {
          ...(await instance.getTrackingData()),
          ...(data.tracking || {}),
          organizeId: instance.organizeId,
        },
        form: data.form || {},
        options: data.options || {},
      });
      return true;
    } catch (error) {
      console.log('Error in cxIdentify:', error);
      throw error;
    }
  }

  public static async cxOpenTicket(
    body: Record<string, any>
  ): Promise<boolean> {
    const instance = ConnectXMobileSdk.getInstance();
    try {
      await instance.cxPost('/webtracking/dropformOpenTicket', {
        key: body.key,
        customers: body.customers,
        ticket: {
          ...body.ticket,
          organizeId: instance.organizeId,
        },
        tracking: {
          ...(await instance.getTrackingData()),
          organizeId: instance.organizeId,
        },
        lead: body.lead,
        customs: body.customs,
      });
      return true;
    } catch (error) {
      console.error('Error in cxOpenTicket:', error);
      throw error;
    }
  }

  public static async cxCreateRecords(
    objectName: string,
    bodies: Record<string, any>[]
  ): Promise<boolean> {
    const instance = ConnectXMobileSdk.getInstance();
    try {
      await instance.cxPost(`/object/${objectName}/composite`, bodies);
      return true;
    } catch (error) {
      console.error('Error in createObject:', error);
      throw error;
    }
  }
}

export default ConnectXMobileSdk;
