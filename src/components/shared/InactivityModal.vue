<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Formatear segundos a MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(authStore.inactivityCountdown / 60)
  const seconds = authStore.inactivityCountdown % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Determinar color del texto basado en el tiempo restante (menos de 60s se pone rojo)
const timerColorClass = computed(() => {
  return authStore.inactivityCountdown <= 60 
    ? 'text-red-500 scale-105 animate-pulse' 
    : 'text-amber-500'
})

const handleKeepWorking = async () => {
  await authStore.sendHeartbeatPing()
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="authStore.showInactivityModal" 
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <div 
        class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 md:p-8 transform transition-all scale-100 animate-scale-up"
      >
        <!-- Icono animado -->
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        <!-- Título y Mensaje -->
        <h3 class="text-xl font-bold text-white text-center mb-2">
          ¡Aviso de Inactividad!
        </h3>
        <p class="text-slate-400 text-center text-sm mb-6 leading-relaxed">
          Tu sesión está a punto de expirar por inactividad. ¿Deseas continuar trabajando en el portal?
        </p>

        <!-- Contador -->
        <div class="bg-slate-950/50 border border-slate-800/80 rounded-xl py-4 px-6 flex flex-col items-center justify-center mb-8">
          <span class="text-xs uppercase tracking-wider text-slate-500 mb-1">
            Tiempo Restante
          </span>
          <span :class="['text-4xl font-extrabold tracking-mono transition-all duration-300', timerColorClass]">
            {{ formattedTime }}
          </span>
        </div>

        <!-- Acciones -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="handleLogout"
            class="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium transition-all duration-200 text-sm cursor-pointer"
            :disabled="authStore.isHeartbeatLoading"
          >
            Cerrar Sesión
          </button>
          
          <button
            @click="handleKeepWorking"
            class="w-full sm:w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer"
            :disabled="authStore.isHeartbeatLoading"
          >
            <span v-if="authStore.isHeartbeatLoading" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Continuar trabajando</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.tracking-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
