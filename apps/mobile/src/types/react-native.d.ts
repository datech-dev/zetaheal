declare module 'react-native' {
  import * as React from 'react';

  export interface StyleProp<T> {}

  export const StyleSheet: {
    create<T extends Record<string, any>>(styles: T): T;
  };

  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  export const TouchableOpacity: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
  export const Modal: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;
  export const StatusBar: React.ComponentType<any>;
  export const Alert: {
    alert(title: string, message?: string, buttons?: any[]): void;
  };
}
