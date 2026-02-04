import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Account, Label } from '../types';

export const useAccountStore = defineStore('accounts', () => {
  // Validation Rules
  const isAccountValid = (a: Account): boolean => {
    const hasLogin = !!a.login && a.login.trim().length > 0 && a.login.length <= 100;
    const hasPassword = a.type === 'LDAP' || (!!a.password && a.password.trim().length > 0 && a.password.length <= 100);
    return hasLogin && hasPassword;
  };

  // Persistence Logic (Only valid data)
  const rawData = JSON.parse(localStorage.getItem('hh_accounts') || '[]');
  const accounts = ref<Account[]>(rawData.filter(isAccountValid));

  watch(accounts, (val) => {
    const validToPersist = val.filter(isAccountValid);
    localStorage.setItem('hh_accounts', JSON.stringify(validToPersist));
  }, { deep: true });

  const createAccount = () => {
    const hasInvalid = accounts.value.some(a => !isAccountValid(a));
    if (hasInvalid) return null;

    const newAcc: Account = {
      id: crypto.randomUUID(),
      labels: [],
      type: 'Локальная',
      login: '',
      password: ''
    };
    accounts.value.push(newAcc);
    return newAcc.id;
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

  return { accounts, createAccount, removeAccount, updateAccount, parseLabels, isAccountValid };
});
