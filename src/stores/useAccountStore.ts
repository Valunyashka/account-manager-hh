import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account, Label } from '../types';

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  const createAccount = () => {
    const newAcc: Account = {
      id: crypto.randomUUID(),
      labels: [],
      type: 'Локальная',
      login: '',
      password: ''
    };
    accounts.value.push(newAcc);
  };

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter(a => a.id !== id);
  };

  const updateAccount = (id: string, data: Partial<Account>) => {
    const idx = accounts.value.findIndex(a => a.id === id);
    if (idx !== -1) {
      accounts.value[idx] = { ...accounts.value[idx], ...data };
    }
  };

  const parseLabels = (raw: string): Label[] => {
    return raw.split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(text => ({ text }));
  };

  // Stub for now
  const isAccountValid = (a: Account) => true;

  return { accounts, createAccount, removeAccount, updateAccount, parseLabels, isAccountValid };
});
