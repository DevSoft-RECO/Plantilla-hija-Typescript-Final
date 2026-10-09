<template>
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <!-- Masas de color a la deriva solo en modo claro; en modo oscuro el fondo es totalmente negro profundo -->
    <div class="absolute -top-48 -left-48 size-[48rem] rounded-full bg-azul-cope/20 dark:hidden blur-[130px] animate-drift-a will-change-transform" />
    <div class="absolute top-1/4 -right-56 size-[42rem] rounded-full bg-mar-cope/20 dark:hidden blur-[130px] animate-drift-b will-change-transform" />
    <div class="absolute -bottom-64 left-1/4 size-[40rem] rounded-full bg-verde-cope/15 dark:hidden blur-[140px] animate-drift-c will-change-transform" />


    <!-- Halo que sigue al cursor -->
    <div
      ref="glow"
      class="absolute inset-0 transition-opacity duration-700"
      :class="active ? 'opacity-100' : 'opacity-0'"
      style="background: radial-gradient(520px circle at var(--gx, 50%) var(--gy, 30%), color-mix(in oklab, var(--color-mar-cope) 14%, transparent), transparent 65%)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const glow = ref<HTMLElement | null>(null)
const active = ref(false)
let raf = 0

const onMove = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  active.value = true
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    glow.value?.style.setProperty('--gx', `${e.clientX}px`)
    glow.value?.style.setProperty('--gy', `${e.clientY}px`)
  })
}
const onLeave = () => { active.value = false }

onMounted(() => {
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>
