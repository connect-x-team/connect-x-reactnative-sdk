declare module 'connect-x-react-native-sdk' {
  interface ConnectXMobileSdkInterface {
    initialize(token: string, organizeId: string, env?: string): Promise<void>;
    cxTracking(body: Record<string, any>): Promise<boolean>;
    cxIdentify(data: Record<string, any>): Promise<boolean>;
    cxOpenTicket(body: Record<string, any>): Promise<boolean>;
    cxCreateRecords(
      objectName: string,
      bodies: Record<string, any>[]
    ): Promise<any>;
    getUnknownId(): Promise<string>;
  }

  const ConnectXMobileSdk: ConnectXMobileSdkInterface;
  export default ConnectXMobileSdk;
}
