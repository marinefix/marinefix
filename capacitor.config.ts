import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marinefix.app',
  appName: 'Marine Fix',
  webDir: 'dist',
  server: {
    url: 'https://marinefix.pages.dev',
    cleartext: true
  }
};

export default config;
