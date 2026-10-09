import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { MediaPermissionProvider } from '../ctx';

export default function RootLayout() {
  return (
    <MediaPermissionProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0F19' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="permission" options={{ headerShown: false }} />
      </Stack>
    </MediaPermissionProvider>
  );
}
