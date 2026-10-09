<template>
  <component
    :is="as"
    class="inline-block bg-clip-text text-transparent bg-gradient-to-r tracking-tight select-none"
    :class="[
      variantClasses,
      sizeClasses,
      weightClasses,
      customClass
    ]"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div'
  text?: string
  variant?: 'brand' | 'brand-light' | 'emerald' | 'cyan' | 'blue'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'custom'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h1',
  text: '',
  variant: 'brand',
  size: '2xl',
  weight: 'black',
  customClass: ''
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'brand':
      // Gradiente corporativo COPE: Azul Cope -> Verde Mar -> Verde Cope
      return 'from-[var(--color-azul-cope)] via-[var(--color-mar-cope)] to-[var(--color-verde-cope)] dark:from-sky-400 dark:via-[var(--color-mar-cope)] dark:to-[var(--color-verde-cope)]'
    case 'brand-light':
      return 'from-sky-400 via-[var(--color-mar-cope)] to-[var(--color-verde-cope)]'
    case 'emerald':
      return 'from-teal-500 via-emerald-500 to-green-500 dark:from-teal-400 dark:via-emerald-400 dark:to-green-400'
    case 'cyan':
      return 'from-blue-600 via-cyan-500 to-teal-400 dark:from-blue-400 dark:via-cyan-300 dark:to-teal-300'
    case 'blue':
      return 'from-blue-700 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-300'
    default:
      return 'from-[var(--color-azul-cope)] via-[var(--color-mar-cope)] to-[var(--color-verde-cope)] dark:from-sky-400 dark:via-[var(--color-mar-cope)] dark:to-[var(--color-verde-cope)]'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'text-xs'
    case 'sm': return 'text-sm'
    case 'md': return 'text-base'
    case 'lg': return 'text-lg sm:text-xl'
    case 'xl': return 'text-xl sm:text-2xl'
    case '2xl': return 'text-2xl sm:text-3xl'
    case '3xl': return 'text-3xl sm:text-4xl'
    case '4xl': return 'text-4xl sm:text-5xl'
    case 'custom': return ''
    default: return 'text-2xl sm:text-3xl'
  }
})

const weightClasses = computed(() => {
  switch (props.weight) {
    case 'normal': return 'font-normal'
    case 'medium': return 'font-medium'
    case 'semibold': return 'font-semibold'
    case 'bold': return 'font-bold'
    case 'extrabold': return 'font-extrabold'
    case 'black': return 'font-black'
    default: return 'font-black'
  }
})
</script>
