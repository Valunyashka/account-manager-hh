<script setup lang="ts">
import { ref } from 'vue';
import { useAccountStore } from '../stores/useAccountStore';
import type { Account } from '../types';

const props = defineProps<{ account: Account }>();
const store = useAccountStore();

const labelStr = ref(props.account.labels.map(l => l.text).join('; '));
const login = ref(props.account.login);
const password = ref(props.account.password || '');
const type = ref(props.account.type);

const update = () => {
  store.updateAccount(props.account.id, {
    login: login.value,
    password: password.value,
    type: type.value,
    labels: store.parseLabels(labelStr.value)
  });
};
</script>

<template>
  <div class="border border-slate-700 p-4 mb-4 rounded bg-slate-800">
    <div class="flex flex-col gap-2">
      <input v-model="labelStr" @blur="update" placeholder="Метки (через ;)" class="bg-slate-700 p-2 rounded text-white" />
      <select v-model="type" @change="update" class="bg-slate-700 p-2 rounded text-white">
        <option value="LDAP">LDAP</option>
        <option value="Локальная">Локальная</option>
      </select>
      <input v-model="login" @blur="update" placeholder="Логин" class="bg-slate-700 p-2 rounded text-white" />
      <input v-if="type === 'Локальная'" v-model="password" @blur="update" placeholder="Пароль" class="bg-slate-700 p-2 rounded text-white" />
      <button @click="store.removeAccount(account.id)" class="text-red-500 font-bold mt-2">Удалить</button>
    </div>
  </div>
</template>
