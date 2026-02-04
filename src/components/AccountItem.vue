<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Trash2, Shield, User, Tag, Eye, EyeOff, AlertTriangle } from 'lucide-vue-next';
import { useAccountStore } from '../stores/useAccountStore';
import type { Account } from '../types';

const props = defineProps<{ account: Account }>();
const store = useAccountStore();

const labelStr = ref(props.account.labels.map(l => l.text).join('; '));
const login = ref(props.account.login);
const password = ref(props.account.password || '');
const type = ref(props.account.type);

const errors = ref({ login: false, password: false });
const isPassVisible = ref(false);
const loginRef = ref<HTMLInputElement | null>(null);

const validate = () => {
  errors.value.login = !login.value || login.value.trim().length === 0;

  if (type.value === 'Локальная') {
    errors.value.password = !password.value || password.value.trim().length === 0;
  } else {
    errors.value.password = false;
  }

  store.updateAccount(props.account.id, {
    login: login.value,
    password: type.value === 'Локальная' ? password.value : null,
    type: type.value,
    labels: store.parseLabels(labelStr.value)
  });
};

const onTypeChange = () => {
  if (type.value === 'LDAP') password.value = '';
  validate();
};

onMounted(async () => {
  if (!login.value && props.account.labels.length === 0) {
    await nextTick();
    loginRef.value?.focus();
  }
});
</script>

<template>
  <div class="glass-card p-6 rounded-2xl mb-4 transition-all duration-300 border-2"
       :class="[ !store.isAccountValid(props.account) ? 'border-orange-500/20 bg-orange-500/5' : 'border-transparent' ]">

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

      <!-- Labels -->
      <div class="xl:col-span-3 space-y-2">
        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
          <Tag :size="12" /> Метки
        </label>
        <input v-model="labelStr" @blur="validate" maxlength="50" placeholder="work; dev"
               class="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"/>
      </div>

      <!-- Type -->
      <div class="xl:col-span-2 space-y-2">
        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
          <Shield :size="12" /> Тип
        </label>
        <select v-model="type" @change="onTypeChange"
                class="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer appearance-none">
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>

      <!-- Login -->
      <div class="xl:col-span-3 space-y-2">
        <div class="flex justify-between items-center">
          <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
            <User :size="12" /> Логин
          </label>
          <span v-if="errors.login" class="text-[9px] font-bold text-red-500 animate-pulse italic flex items-center gap-1">
             <AlertTriangle :size="10" /> Не заполнен
          </span>
        </div>
        <input ref="loginRef" v-model="login" @blur="validate" maxlength="100"
               :class="['w-full bg-slate-900/60 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all',
                         errors.login ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-700 focus:border-blue-500']" />
      </div>

      <!-- Password -->
      <div class="xl:col-span-3 space-y-2" v-if="type === 'Локальная'">
        <div class="flex justify-between items-center">
          <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
            <Eye :size="12" /> Пароль
          </label>
          <span v-if="errors.password" class="text-[9px] font-bold text-red-500 animate-pulse italic flex items-center gap-1">
             <AlertTriangle :size="10" /> Не заполнен
          </span>
        </div>
        <div class="relative">
          <input v-model="password" @blur="validate" :type="isPassVisible ? 'text' : 'password'" maxlength="100"
                 :class="['w-full bg-slate-900/60 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-10',
                           errors.password ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-700 focus:border-blue-500']" />
          <button @click="isPassVisible = !isPassVisible" class="absolute right-3 top-2.5 text-slate-500 hover:text-white">
            <component :is="isPassVisible ? EyeOff : Eye" :size="16" />
          </button>
        </div>
      </div>
      <div v-else class="xl:col-span-3 pt-8 px-4 opacity-30 select-none">
        <p class="text-[10px] text-slate-400 font-bold italic">PASSWORD PROTECTED BY LDAP</p>
      </div>

      <!-- Actions -->
      <div class="xl:col-span-1 flex justify-end pt-7">
        <button @click="store.removeAccount(props.account.id)"
                class="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-lg hover:shadow-red-900/20">
          <Trash2 :size="18" />
        </button>
      </div>
    </div>

    <!-- Status Footer -->
    <div v-if="!store.isAccountValid(props.account)" class="mt-4 pt-4 border-t border-slate-800/50 flex items-center gap-2">
       <div class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></div>
       <span class="text-[9px] font-black text-orange-500/80 uppercase tracking-widest">Внимание: запись не будет сохранена в базу до исправления ошибок</span>
    </div>
  </div>
</template>
