<template>
  <div class="relative flex h-screen bg-niebla dark:bg-black text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">

    <!-- Fondo ambiental (detrás de todo) -->
    <AuroraBackground />

    <AdminSidebar />

    <div
      class="relative z-10 flex flex-col flex-1 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
      :class="[layoutStore.isCollapsed ? 'md:ml-20' : 'md:ml-[230px]']"
    >

      <AdminHeader />

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 relative custom-scrollbar">
        <RouterView v-slot="{ Component }">
            <component :is="Component" />
        </RouterView>
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AdminSidebar from "../components/layout/AdminSidebar.vue"
import AdminHeader from "../components/layout/AdminHeader.vue"
import AuroraBackground from "../components/layout/AuroraBackground.vue"
import { useLayoutStore } from "@/stores/layout"

const layoutStore = useLayoutStore()

onMounted(() => {
  layoutStore.initTheme()
  window.addEventListener('resize', layoutStore.handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', layoutStore.handleResize)
})
</script>

<style>
/* Ocultar barra de scroll visual manteniendo el scroll natural por ratón, trackpad y táctil */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.custom-scrollbar {
  -ms-overflow-style: none; /* IE y Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
