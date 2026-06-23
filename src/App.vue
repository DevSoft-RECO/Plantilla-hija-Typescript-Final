<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InactivityModal from '@/components/shared/InactivityModal.vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Detect '/callback' to avoid premature checkAuth
  const isCallbackRoute = window.location.pathname.startsWith('/callback');

  if (!isCallbackRoute) {
      await authStore.checkAuth() 
      
      // Si el usuario ya está autenticado (persistencia), inicializar el canal de WebSockets de inmediato
      if (authStore.token && authStore.user) {
        authStore.initSessionSocket()
      }
  }

  // Remove preloader with fade-out
  const loader = document.getElementById('loading-wrapper');
  if (loader) {
    loader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 500);
  }
})

onBeforeUnmount(() => {
  // Asegurar la desconexión del socket al desmontar
  authStore.disconnectSessionSocket()
})
</script>

<template>
  <RouterView />
  
  <!-- Modal global para controlar inactividad y sincronizar pestañas -->
  <InactivityModal />
</template>
