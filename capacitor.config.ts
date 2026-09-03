import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marinefix.app',
  appName: 'Marine Fix',
  webDir: 'dist',
  server: {
    url: 'https://marinefixapp.pages.dev',
    cleartext: true
  }
};

export default config;