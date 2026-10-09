<template>
  <header
    class="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6
           bg-white/80 dark:bg-oscuro backdrop-blur-xl
           transition-colors duration-300 relative"
  >
    <div class="flex items-center gap-3 md:gap-4">

      <!-- Mobile Sidebar Toggle -->
      <button
        @click="layoutStore.toggleSidebar"
        class="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-200
               hover:text-[var(--color-azul-cope)] dark:hover:text-white
               hover:bg-[#0fa88f]/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Abrir menú"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Desktop Sidebar Toggle -->
      <button
        @click="layoutStore.toggleCollapse"
        class="hidden md:flex p-2 rounded-xl text-slate-500 dark:text-slate-200
               hover:text-[var(--color-azul-cope)] dark:hover:text-white
               hover:bg-[#0fa88f]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
        :title="layoutStore.isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'"
      >
        <svg
          class="w-6 h-6 transition-transform duration-300"
          :class="layoutStore.isCollapsed ? 'rotate-180' : ''"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      <!-- Branding / Title con la paleta del concepto -->
      <div class="flex flex-col ml-1">
        <span class="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <span class="size-1.5 rounded-full bg-[var(--color-verde-cope)] shadow-[0_0_6px_var(--color-verde-cope)]"></span>
          <span>Estás en</span>
        </span>
        <h1 class="text-lg font-black text-[var(--color-azul-cope)] dark:text-white uppercase tracking-tight leading-tight truncate">
          {{ currentRouteTitle }}
        </h1>
      </div>
    </div>

    <!-- Right Side Actions -->
    <div class="flex items-center gap-3 sm:gap-4">

      <!-- Theme Toggle con efecto suave -->
      <button
        @click="layoutStore.toggleTheme"
        class="p-2 rounded-xl text-slate-500 dark:text-slate-400
               hover:text-amber-500 dark:hover:text-yellow-400
               hover:bg-[#0fa88f]/10 dark:hover:bg-white/10
               transition-colors focus:outline-none cursor-pointer"
        :title="layoutStore.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <!-- Sol -->
        <svg v-if="layoutStore.isDark" class="w-5.5 h-5.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Luna -->
        <svg v-else class="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- Divisor vertical discreto -->
      <div class="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

      <!-- Perfil con Menú Desplegable (Oculta botón de salir para mayor limpieza) -->
      <div class="relative">
        <button
          @click="isProfileMenuOpen = !isProfileMenuOpen"
          class="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-verde-cope)] group"
          aria-haspopup="true"
          :aria-expanded="isProfileMenuOpen"
          title="Opciones de perfil"
        >
          <!-- Nombre y agencia (pantallas medianas) -->
          <div class="hidden md:block text-right">
            <p class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-tight group-hover:text-[var(--color-azul-cope)] dark:group-hover:text-white transition-colors">
              {{ userName }}
            </p>
            <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate leading-tight">
              {{ userAgencia }}
            </p>
          </div>

          <!-- Avatar con aro verde corporativo -->
          <div class="relative shrink-0">
            <img
              v-if="userPhoto"
              :src="userPhoto"
              class="h-9.5 w-9.5 rounded-full object-cover border-2 border-[var(--color-verde-cope)] shadow-sm transition-transform group-hover:scale-105"
              alt="Avatar"
            />
            <div
              v-else
              class="h-9.5 w-9.5 rounded-full bg-[var(--color-azul-cope)] text-white flex items-center justify-center font-black text-xs border-2 border-[var(--color-verde-cope)] shadow-sm transition-transform group-hover:scale-105"
            >
              {{ userInitials }}
            </div>
            <!-- Punto de estado verde -->
            <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[var(--color-verde-cope)] border-2 border-white dark:border-[#031525]"></span>
          </div>

          <!-- Chevron indicador de menú -->
          <svg
            class="size-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 hidden sm:block"
            :class="isProfileMenuOpen ? 'rotate-180 text-[var(--color-azul-cope)] dark:text-[var(--color-verde-cope)]' : ''"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Overlay transparente para cerrar al hacer clic o toque fuera -->
        <div
          v-if="isProfileMenuOpen"
          class="fixed inset-0 z-40 bg-transparent"
          @click="isProfileMenuOpen = false"
        ></div>

        <!-- Menú Desplegable Flotante del Perfil (Estilo Glass Limpio) -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
            v-if="isProfileMenuOpen"
            class="absolute right-0 top-full mt-2 w-64
                   bg-white dark:bg-oscuro backdrop-blur-2xl
                   border border-slate-200/90 dark:border-white/10 rounded-2xl
                   shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.7)]
                   p-2.5 z-50 origin-top-right"
          >
            <!-- Cabecera con datos del usuario dentro del menú -->
            <div class="px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 mb-2">
              <div class="flex items-center gap-2 mb-1">
                <span class="size-2 rounded-full bg-[var(--color-verde-cope)] shadow-[0_0_6px_var(--color-verde-cope)]"></span>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Sesión Activa</span>
              </div>
              <p class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">
                {{ userName }}
              </p>
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {{ userAgencia }}
              </p>
            </div>

            <!-- Botón de acción: Regresar al portal -->
            <button
              @click="handleReturnToMother"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                     text-rose-600 dark:text-rose-400
                     hover:bg-rose-50 dark:hover:bg-rose-950/40
                     transition-all duration-150 cursor-pointer group"
            >
              <div class="size-8 rounded-lg bg-rose-100/70 dark:bg-rose-500/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg class="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold leading-tight">Regresar al portal</span>
                <span class="text-[10px] text-rose-500/70 dark:text-rose-400/60 leading-tight">Cerrar sesión en esta app</span>
              </div>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Borde inferior continuo con curva cóncava integrada -->
    <div class="absolute top-full left-0 right-0 pointer-events-none z-30">
      <!-- Línea horizontal que va desde el final de la curva hacia la derecha -->
      <div class="absolute top-0 left-0 md:left-7 right-0 h-px bg-[#0fa88f]/40 dark:bg-transparent transition-colors duration-300"></div>

      <!-- Curva cóncava hacia adentro -->
      <div class="hidden md:block absolute top-0 left-0 w-7 h-7">
        <svg class="w-7 h-7 block" viewBox="0 0 28 28">
          <!-- Relleno cóncavo del Header (transición sincronizada de color) -->
          <path
            d="M 0 0 L 28 0 A 28 28 0 0 0 0 28 Z"
            class="fill-white/80 dark:fill-oscuro transition-all duration-300"
          />
          <!-- Borde curvo conectado exactamente a la línea horizontal -->
          <path
            d="M 28 0.5 A 27.5 27.5 0 0 0 0.5 28"
            fill="none"
            stroke="#0fa88f"
            stroke-opacity="0.4"
            stroke-width="1"
            class="dark:stroke-transparent transition-all duration-300"
          />
        </svg>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import { useLayoutStore } from "@/stores/layout"
import { useAuthStore } from "@/stores/auth"
import { getAvatarUrl } from "@/utils/imageUtils"

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const route = useRoute()

const isProfileMenuOpen = ref(false)

// Datos del usuario (Protegidos contra null)
const userName = computed(() => authStore.user?.name || "Usuario")

/**
 * TOGGLE DE BACKEND: 
 * Descomenta la línea según el backend que estés utilizando.
 */
// const userAgencia = computed(() => authStore.user?.agencia || "Sin Agencia") // BACKEND GO (Retorna String)
const userAgencia = computed(() => authStore.user?.agencia?.nombre || "Sin Agencia") // BACKEND LARAVEL (Retorna Objeto)

const userPhoto = computed(() => getAvatarUrl(authStore.user?.avatar) || null)

// Título dinámico
const currentRouteTitle = computed(() => route.meta?.title || 'Panel')

// Iniciales
const userInitials = computed(() => {
  return (userName.value || "U").substring(0, 2).toUpperCase()
})

const handleReturnToMother = () => {
  isProfileMenuOpen.value = false
  authStore.logoutLocal() 
  window.location.href = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
}

// Cerrar menú con tecla Escape
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isProfileMenuOpen.value) {
    isProfileMenuOpen.value = false
  }
}

// Asegurar que tenemos datos al cargar y registrar listener
onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  if (!authStore.user) {
    await authStore.checkAuth()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
