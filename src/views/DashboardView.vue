<template>
  <div class="space-y-6">
    <!-- Header de Bienvenida -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <GradientTitle as="h1" size="2xl" weight="black">
          Panel de Control
        </GradientTitle>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Bienvenido al Sistema de Gestión de Riesgos Cooperativa Elga.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistema Operativo
        </span>
      </div>
    </div>

    <!-- Tarjeta Principal de Bienvenida -->
    <div class="relative overflow-hidden rounded-2xl bg-claro dark:bg-oscuro p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-white/5 transition-colors">
      <div class="relative z-10 max-w-2xl space-y-3">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-azul-cope/10 dark:bg-azul-cope/20 text-azul-cope dark:text-sky-400 text-xs font-semibold">
          <span>COOPERATIVA ELGA</span>
        </div>
        <div>
          <GradientTitle as="h2" size="xl" weight="extrabold">
            Bienvenido al Módulo de Riesgos
          </GradientTitle>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Desde aquí puedes gestionar los eventos de riesgo, matrices de control, indicadores clave y reportes regulatorios con total trazabilidad.
        </p>
      </div>
    </div>

    <!-- Grid de Tarjetas de Resumen usando bg-claro y dark:bg-oscuro -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="card in summaryCards"
        :key="card.title"
        class="rounded-xl bg-claro dark:bg-oscuro p-5 shadow-sm border border-slate-200/80 dark:border-white/5 transition-all hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ card.title }}
          </span>
          <div :class="['p-2 rounded-lg', card.iconBg]">
            <component :is="card.icon" class="size-5" :class="card.iconColor" />
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold text-slate-800 dark:text-white">
            {{ card.value }}
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span :class="card.trendColor" class="font-medium">{{ card.trend }}</span>
            <span>vs mes anterior</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Contenedor Secundario de Ejemplo -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 rounded-xl bg-claro dark:bg-oscuro p-6 shadow-sm border border-slate-200/80 dark:border-white/5">
        <h3 class="text-base font-semibold text-slate-800 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        <div class="space-y-4">
          <div
            v-for="(activity, idx) in recentActivities"
            :key="idx"
            class="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0"
          >
            <div class="size-2.5 rounded-full bg-azul-cope dark:bg-sky-400 mt-1.5 shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 dark:text-white truncate">
                {{ activity.title }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ activity.subtitle }}
              </p>
            </div>
            <span class="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {{ activity.time }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-claro dark:bg-oscuro p-6 shadow-sm border border-slate-200/80 dark:border-white/5 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-white mb-2">
            Estado de Alertas
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Monitoreo continuo de eventos de riesgo activos.
          </p>
          <div class="space-y-3">
            <div class="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
              <span>Riesgo Operativo</span>
              <span class="text-emerald-600 dark:text-emerald-400">Normal</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-black/40 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full" style="width: 25%"></div>
            </div>

            <div class="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
              <span>Riesgo Crediticio</span>
              <span class="text-amber-600 dark:text-amber-400">Moderado</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-black/40 rounded-full h-2">
              <div class="bg-amber-500 h-2 rounded-full" style="width: 60%"></div>
            </div>

            <div class="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
              <span>Riesgo de Liquidez</span>
              <span class="text-emerald-600 dark:text-emerald-400">Bajo</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-black/40 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full" style="width: 15%"></div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
          <button class="w-full py-2 px-4 rounded-lg bg-azul-cope hover:bg-azul-cope/90 text-white text-xs font-semibold transition-colors">
            Ver Reporte Detallado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import GradientTitle from '@/components/shared/GradientTitle.vue'

// Iconos SVG simples renderizados con funciones h()
const DocumentIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' })
  ])

const ShieldAlertIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z' })
  ])

const CheckCircleIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' })
  ])

const UsersIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' })
  ])

const summaryCards = [
  {
    title: 'Eventos Registrados',
    value: '128',
    trend: '+12%',
    trendColor: 'text-emerald-600 dark:text-emerald-400',
    icon: DocumentIcon,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Riesgos Críticos',
    value: '3',
    trend: '-2',
    trendColor: 'text-emerald-600 dark:text-emerald-400',
    icon: ShieldAlertIcon,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    title: 'Controles Mitigados',
    value: '94.2%',
    trend: '+4.1%',
    trendColor: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircleIcon,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    title: 'Usuarios Activos',
    value: '42',
    trend: '+6',
    trendColor: 'text-sky-600 dark:text-sky-400',
    icon: UsersIcon,
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  }
]

const recentActivities = [
  {
    title: 'Nuevo evento de riesgo operacional registrado',
    subtitle: 'Agencia Principal - Cajas',
    time: 'Hace 15 min'
  },
  {
    title: 'Evaluación de control de crédito aprobada',
    subtitle: 'Comité de Riesgos',
    time: 'Hace 1 hora'
  },
  {
    title: 'Actualización de matriz de contingencia de TI',
    subtitle: 'Dpto. de Tecnología',
    time: 'Hace 3 horas'
  }
]
</script>
