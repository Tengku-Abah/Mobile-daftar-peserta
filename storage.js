// storage.js
import * as SecureStore from 'expo-secure-store';

const KEY_USER = 'user';

export async function saveUser(user) {
  await SecureStore.setItemAsync(KEY_USER, JSON.stringify(user));
}

export async function getUser() {
  const json = await SecureStore.getItemAsync(KEY_USER);
  return json ? JSON.parse(json) : null;
}

export async function clearUser() {
  await SecureStore.deleteItemAsync(KEY_USER);
}
