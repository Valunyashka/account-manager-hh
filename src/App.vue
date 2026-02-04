<script setup lang="ts">
import { useAccountStore } from './stores/useAccountStore';
import AccountItem from './components/AccountItem.vue';
import { Plus, HelpCircle } from 'lucide-vue-next';

const store = useAccountStore();
</script>

<template>
  <div class="min-h-screen max-w-6xl mx-auto px-6 py-16">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
      <div>
        <h1 class="text-5xl font-black tracking-tighter text-white mb-2">
          HH ACCOUNTS<span class="text-blue-500">.</span>
        </h1>
        <div class="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <div class="w-8 h-1 bg-blue-500"></div>
          System Access Control
        </div>
      </div>

      <button
        @click="store.createAccount"
        class="group relative flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
      >
        <Plus :size="20" /> Добавить
      </button>
    </header>

    <!-- UI Hint -->
    <div class="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-12 flex items-center gap-4">
      <HelpCircle class="text-blue-400 shrink-0" :size="24" />
      <p class="text-xs text-slate-400 leading-relaxed font-medium">
        Для ввода меток используйте символ <span class="text-blue-400 font-bold">;</span>.
        Поля <span class="text-white underline">Логин</span> и <span class="text-white underline">Пароль</span> (для локальных записей) являются обязательными.
        Пустые записи будут автоматически удалены при следующем входе в систему.
      </p>
    </div>

    <!-- Accounts Grid -->
    <div class="relative">
      <transition-group
        name="acc-list"
        tag="div"
        class="account-container"
      >
        <AccountItem
          v-for="acc in store.accounts"
          :key="acc.id"
          :account="acc"
        />
      </transition-group>

      <!-- Empty State -->
      <div v-if="store.accounts.length === 0" class="py-40 text-center border-2 border-dashed border-slate-800 rounded-3xl">
        <p class="text-slate-600 font-bold uppercase tracking-widest text-sm">Нет активных учетных записей</p>
      </div>
    </div>
  </div>
</template>
