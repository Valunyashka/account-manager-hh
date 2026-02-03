<script setup lang="ts">
import { useAccountStore } from './stores/useAccountStore';
import AccountItem from './components/AccountItem.vue';

const store = useAccountStore();
</script>

<template>
  <div class="p-10 max-w-4xl mx-auto">
    <h1 class="text-3xl mb-6 text-white font-bold">HH Accounts</h1>
    <button @click="store.createAccount" class="bg-blue-600 text-white px-6 py-2 rounded mb-6 hover:bg-blue-700">
      + Добавить запись
    </button>
    <div v-for="acc in store.accounts" :key="acc.id">
      <AccountItem :account="acc" />
    </div>
  </div>
</template>
