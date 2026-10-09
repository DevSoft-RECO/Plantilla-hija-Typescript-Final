<template>
  <!-- Overlay para móviles cuando el sidebar está abierto -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="layoutStore.isSidebarOpen"
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
      @click="layoutStore.closeSidebar"
    ></div>
  </Transition>

  <!-- ===== ASIDE / BARRA LATERAL (DISEÑO CÁPSULA Y BADGES CIRCULARES) ===== -->
  <aside
    ref="sidebarRef"
    class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300
           bg-oscuro
           border-r border-[#0fa88f]/30 dark:border-transparent dark:border-r-0
           shadow-[0_20px_50px_-15px_rgba(1,61,123,0.35)] dark:shadow-none"
    :class="[
      layoutStore.isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      layoutStore.isCollapsed ? 'w-20 overflow-visible' : 'w-[230px] overflow-hidden'
    ]"
  >
    <!-- Capa de degradado corporativo con transición suave perfectamente sincronizada a 300ms -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-[#013465] via-[#024a68] to-[#046571]
             transition-opacity duration-300 pointer-events-none -z-10
             opacity-100 dark:opacity-0"
    ></div>
    <!-- CABECERA: LOGO -->
    <div class="h-16 flex items-center justify-between px-4 shrink-0">
      <!-- Logo expandido -->
      <div v-if="!layoutStore.isCollapsed" class="flex items-center justify-center w-full fade-in">
        <img src="@/assets/logoyk1.svg" alt="YK" class="h-10 w-auto object-contain transition-all" />
      </div>

      <!-- Logo colapsado (Solo el logo limpio) -->
      <div v-else class="w-full flex justify-center fade-in">
        <img src="@/assets/yk.png" alt="YK" class="h-8 w-auto object-contain transition-transform hover:scale-105" />
      </div>
    </div>

    <!-- SECCIÓN DE PERFIL DE USUARIO LOGUEADO -->
    <!-- Modo Expandido -->
    <div v-if="!layoutStore.isCollapsed" class="px-3.5 pt-2 pb-1 shrink-0 fade-in">
      <div class="flex items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5 min-w-0">
          <!-- Avatar con aro y punto verde online -->
          <div class="relative shrink-0">
            <img
              v-if="userPhoto"
              :src="userPhoto"
              class="size-9 rounded-full object-cover border-2 border-[var(--color-verde-cope)] shadow-sm"
              alt="Avatar"
            />
            <div
              v-else
              class="size-9 rounded-full bg-[var(--color-azul-cope)] dark:bg-[#1e2330] text-white flex items-center justify-center font-bold text-xs border-2 border-[var(--color-verde-cope)] shadow-sm"
            >
              {{ userInitials }}
            </div>
            <!-- Punto indicador online -->
            <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[var(--color-verde-cope)] border-2 border-[#013465] dark:border-[var(--color-oscuro)]"></span>
          </div>

          <!-- Nombre y Rol -->
          <div class="min-w-0 flex-1">
            <h4 class="text-[13px] font-bold text-white tracking-tight truncate leading-tight" :title="userName">
              {{ userName }}
            </h4>
            <p class="text-[11px] text-white/70 dark:text-slate-400 truncate leading-tight font-medium mt-0.5">
              {{ userRole }}
            </p>
          </div>
        </div>

        <!-- Botón 3 puntos verticales -->
        <div class="relative shrink-0">
          <button
            type="button"
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Opciones de usuario"
          >
            <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          <!-- Menú desplegable flotante de usuario -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-1"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-oscuro backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-xl shadow-2xl p-1.5 z-50 origin-top-right"
            >
              <div class="px-2 py-1 border-b border-slate-100 dark:border-white/5 mb-1">
                <p class="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sesión Activa</p>
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ userName }}</p>
              </div>
              <button
                @click="handleReturnToMother"
                class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
              >
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Etiqueta de Sección Navegación -->
      <div class="mt-4 mb-1 pl-1 flex items-center">
        <span class="text-[11px] font-bold uppercase tracking-wider text-white/50 dark:text-slate-500">
          Navegación
        </span>
      </div>
    </div>

    <!-- Modo Colapsado -->
    <div
      v-else
      class="py-2.5 flex flex-col items-center shrink-0 group relative fade-in"
      @mouseenter="activeCollapsedGroup = null"
    >
      <div class="relative cursor-pointer" @click="isUserMenuOpen = !isUserMenuOpen">
        <img
          v-if="userPhoto"
          :src="userPhoto"
          class="size-10 rounded-full object-cover border-2 border-[var(--color-verde-cope)] shadow-sm transition-transform group-hover:scale-105"
          alt="Avatar"
        />
        <div
          v-else
          class="size-10 rounded-full bg-white/15 dark:bg-[#1e2330] text-white flex items-center justify-center font-bold text-xs border-2 border-[var(--color-verde-cope)] shadow-sm transition-transform group-hover:scale-105"
        >
          {{ userInitials }}
        </div>
        <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[var(--color-verde-cope)] border-2 border-[#013465] dark:border-[var(--color-oscuro)]"></span>
      </div>

      <!-- Popover del usuario en modo colapsado -->
      <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-2
               bg-white/95 dark:bg-oscuro backdrop-blur-xl
               text-slate-800 dark:text-slate-100 text-xs rounded-xl
               shadow-2xl border border-slate-200/90 dark:border-white/15 whitespace-nowrap z-50
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               transition-all duration-200 pointer-events-none"
      >
        <p class="font-bold text-slate-800 dark:text-white">{{ userName }}</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ userRole }}</p>
        <div class="absolute top-1/2 -left-1.5 -translate-y-1/2 size-2.5 bg-white border-l border-b border-slate-200/90 dark:bg-oscuro dark:border-white/15 transform rotate-45"></div>
      </div>
    </div>

    <!-- SECCIÓN DE NAVEGACIÓN -->
    <nav
      class="flex-1 py-2 custom-scrollbar"
      :class="layoutStore.isCollapsed ? 'overflow-visible space-y-3.5 flex flex-col items-center' : 'overflow-y-auto overflow-x-hidden space-y-1.5'"
      @mouseleave="layoutStore.isCollapsed && (activeCollapsedGroup = null)"
    >

      <!-- ========================================== -->
      <!-- CASO A: MODO EXPANDIDO                     -->
      <!-- ========================================== -->
      <template v-if="!layoutStore.isCollapsed">
        <template v-for="item in menuItems" :key="item.id">

          <!-- 1. ÍTEM DIRECTO EXPANDIDO (SIN HIJOS) -->
          <div v-if="!item.children" class="relative group w-full pr-3">
            <RouterLink
              :to="item.route"
              @click="handleItemClick"
              class="flex items-center gap-2.5 py-1.5 w-full rounded-r-full border-y border-r border-transparent transition-colors duration-150 group relative pl-3 pr-3.5"
              :class="[
                isActive(item.route)
                  ? 'bg-[#012548]/95 dark:bg-[#0c0f16] !border-white/10 dark:!border-transparent shadow-lg text-white font-semibold'
                  : 'text-white/80 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/[0.04] font-medium'
              ]"
            >
              <!-- Barra vertical indicadora izquierda (activa: 3px) -->
              <div
                class="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-verde-cope)] rounded-r-xs shadow-[0_0_8px_var(--color-verde-cope)] transition-opacity duration-150"
                :class="isActive(item.route) ? 'opacity-100' : 'opacity-0 pointer-events-none'"
              />

              <!-- Badge circular con icono compacto (34px), icono permanece size-5 -->
              <div
                class="size-8.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150"
                :class="[
                  isActive(item.route)
                    ? 'bg-white/15 dark:bg-[#1a202c] shadow-inner ring-1 ring-white/10 dark:ring-transparent'
                    : 'bg-white/10 dark:bg-[#1e2330] group-hover:bg-white/20 dark:group-hover:bg-[#282f40] shadow-sm'
                ]"
              >
                <svg
                  v-html="item.iconSvg"
                  class="size-5 transition-transform group-hover:scale-110"
                  :class="isActive(item.route) ? (item.iconColor || 'text-cyan-400') : 'text-white/85 dark:text-slate-300 group-hover:text-white'"
                  fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                />
              </div>

              <!-- Etiqueta del ítem -->
              <span class="text-[13px] truncate tracking-tight">
                {{ item.label }}
              </span>
            </RouterLink>
          </div>

          <!-- 2. ÍTEM GRUPO EXPANDIDO (CON HIJOS) -->
          <div v-else class="relative group w-full pr-3">
            <button
              type="button"
              @click="handleGroupClick(item.id)"
              class="flex items-center justify-between w-full py-1.5 rounded-r-full border-y border-r border-transparent transition-colors duration-150 group cursor-pointer relative pl-3 pr-3.5"
              :class="[
                isGroupActive(item)
                  ? 'bg-[#012548]/95 dark:bg-[#0c0f16] !border-white/10 dark:!border-transparent shadow-lg text-white font-semibold'
                  : 'text-white/80 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/[0.04] font-medium'
              ]"
            >
              <!-- Barra vertical indicadora si el grupo está activo: 3px -->
              <div
                class="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-verde-cope)] rounded-r-xs shadow-[0_0_8px_var(--color-verde-cope)] transition-opacity duration-150"
                :class="isGroupActive(item) ? 'opacity-100' : 'opacity-0 pointer-events-none'"
              />

              <div class="flex items-center gap-2.5 min-w-0">
                <!-- Badge circular con icono compacto (34px), icono permanece size-5 -->
                <div
                  class="size-8.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150"
                  :class="[
                    isGroupActive(item)
                      ? 'bg-white/15 dark:bg-[#1a202c] shadow-inner ring-1 ring-white/10 dark:ring-transparent'
                      : 'bg-white/10 dark:bg-[#1e2330] group-hover:bg-white/20 dark:group-hover:bg-[#282f40] shadow-sm'
                  ]"
                >
                  <svg
                    v-html="item.iconSvg"
                    class="size-5 transition-transform group-hover:scale-110"
                    :class="isGroupActive(item) ? (item.iconColor || 'text-emerald-400') : 'text-white/85 dark:text-slate-300 group-hover:text-white'"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                  />
                </div>

                <!-- Etiqueta con separación armonizada -->
                <span class="text-[13px] truncate tracking-tight text-left">
                  {{ item.label }}
                </span>
              </div>

              <!-- Flecha chevron alineada a la derecha -->
              <svg
                class="size-4 shrink-0 transition-transform duration-300 mr-0.5 text-slate-400 group-hover:text-white"
                :class="openGroups.includes(item.id) ? 'rotate-180 text-[var(--color-verde-cope)]' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Submenú acordeón expandido (Idéntico al estilo de diseño) -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-60"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 max-h-60"
              leave-to-class="opacity-0 max-h-0"
            >
              <div
                v-if="openGroups.includes(item.id)"
                class="pl-4 pr-2 pt-1.5 pb-2 space-y-2.5 overflow-hidden"
              >
                <RouterLink
                  v-for="child in item.children"
                  :key="child.route"
                  :to="child.route"
                  @click="handleItemClick"
                  class="flex items-center gap-2 py-0.5 text-[12.5px] transition-all duration-150 cursor-pointer group/child"
                  :class="isActive(child.route)
                    ? 'text-white font-bold translate-x-1'
                    : 'text-white/70 dark:text-slate-400 hover:text-white dark:hover:text-white font-normal hover:translate-x-1'"
                >
                  <!-- Flecha indicadora de opción activa -->
                  <span
                    v-if="isActive(child.route)"
                    class="flex items-center justify-center shrink-0 size-3.5 text-[var(--color-verde-cope)]"
                  >
                    <svg class="size-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                  <span v-else class="size-1.5 rounded-full bg-white/25 dark:bg-white/15 shrink-0 mx-1"></span>

                  <!-- Texto con subrayado degradado progresivo de 0 a 100% en hover -->
                  <span class="relative pb-0.5 inline-block truncate">
                    {{ child.label }}
                    <span
                      class="absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-[var(--color-mar-cope)] to-[var(--color-verde-cope)] shadow-[0_0_6px_var(--color-verde-cope)] w-0 group-hover/child:w-full transition-all duration-300 ease-out opacity-0 group-hover/child:opacity-100 pointer-events-none"
                    ></span>
                  </span>
                </RouterLink>
              </div>
            </Transition>
          </div>

        </template>
      </template>

      <!-- ========================================== -->
      <!-- CASO B: MODO CONTRAÍDO                     -->
      <!-- ========================================== -->
      <template v-else>
        <template v-for="item in menuItems" :key="item.id">

          <!-- 1. ÍTEM DIRECTO CONTRAÍDO (SIN HIJOS) -->
          <div
            v-if="!item.children"
            class="relative group w-full flex justify-center"
            @mouseenter="activeCollapsedGroup = null"
          >
            <RouterLink
              :to="item.route"
              @click="handleItemClick"
              class="relative flex items-center transition-all duration-200 group"
              :class="[
                isActive(item.route)
                  ? 'w-full h-12 pl-0 pr-2 justify-center'
                  : 'size-11 justify-center'
              ]"
            >
              <!-- Cápsula activa que toca el borde izquierdo -->
              <div
                v-if="isActive(item.route)"
                class="w-full h-full flex items-center justify-center rounded-r-full bg-[#012548] dark:bg-[#0c0f16] border-y border-r border-white/10 dark:border-transparent shadow-lg relative"
              >
                <!-- Barra vertical izquierda indicadora (3px) -->
                <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-verde-cope)] rounded-r-xs shadow-[0_0_8px_var(--color-verde-cope)]" />

                <!-- Badge circular centrado -->
                <div class="size-10 rounded-full flex items-center justify-center bg-white/15 dark:bg-[#1a202c] shadow-inner ring-1 ring-white/10 dark:ring-transparent">
                  <svg
                    v-html="item.iconSvg"
                    class="size-5.5 transition-transform group-hover:scale-110"
                    :class="item.iconColor || 'text-cyan-400'"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                  />
                </div>
              </div>

              <!-- Badge circular inactivo estándar -->
              <div
                v-else
                class="size-10 rounded-full flex items-center justify-center bg-white/10 dark:bg-[#1e2330] hover:bg-white/20 dark:hover:bg-[#282f40] transition-all shadow-sm"
              >
                <svg
                  v-html="item.iconSvg"
                  class="size-5.5 transition-transform group-hover:scale-110"
                  :class="item.iconColor || 'text-white'"
                  fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                />
              </div>
            </RouterLink>

            <!-- Tooltip en modo colapsado -->
            <div
              class="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3.5 py-2
                     bg-white/95 dark:bg-oscuro backdrop-blur-xl
                     text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl
                     shadow-2xl border border-slate-200/90 dark:border-white/15 whitespace-nowrap z-50
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible
                     transition-all duration-200 pointer-events-none flex items-center gap-2"
            >
              <span :class="isActive(item.route) ? 'text-[#0090e7] dark:text-cyan-400 font-black' : 'text-slate-800 dark:text-slate-200'">{{ item.label }}</span>
              <span v-if="isActive(item.route)" class="size-1.5 rounded-full bg-[#0090e7] dark:bg-cyan-400 shadow-[0_0_6px_#0090e7]"></span>
              <div class="absolute top-1/2 -left-1.5 -translate-y-1/2 size-2.5 bg-white border-l border-b border-slate-200/90 dark:bg-oscuro dark:border-white/15 transform rotate-45"></div>
            </div>
          </div>

          <!-- 2. ÍTEM GRUPO CONTRAÍDO (CON HIJOS) -->
          <div
            v-else
            class="relative group w-full flex justify-center"
            @mouseenter="activeCollapsedGroup = item.id"
            @mouseleave="activeCollapsedGroup = null"
          >
            <button
              type="button"
              @click="handleGroupClick(item.id)"
              class="relative flex items-center transition-all duration-200 group cursor-pointer"
              :class="[
                isGroupActive(item)
                  ? 'w-full h-12 pl-0 pr-2 justify-center'
                  : 'size-11 justify-center'
              ]"
            >
              <!-- Cápsula activa si el grupo está activo: 3px -->
              <div
                v-if="isGroupActive(item)"
                class="w-full h-full flex items-center justify-center rounded-r-full bg-[#012548] dark:bg-[#0c0f16] border-y border-r border-white/10 dark:border-transparent shadow-lg relative"
              >
                <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-verde-cope)] rounded-r-xs shadow-[0_0_8px_var(--color-verde-cope)]" />
                <div class="size-10 rounded-full flex items-center justify-center bg-white/15 dark:bg-[#1a202c] shadow-inner ring-1 ring-white/10 dark:ring-transparent">
                  <svg
                    v-html="item.iconSvg"
                    class="size-5.5 transition-transform group-hover:scale-110"
                    :class="item.iconColor || 'text-amber-400'"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                  />
                </div>
              </div>

              <!-- Si está inactivo pero abierto por toque táctil o hover -->
              <div
                v-else-if="activeCollapsedGroup === item.id"
                class="size-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-[#282f40] ring-2 ring-[var(--color-verde-cope)] transition-all shadow-md"
              >
                <svg
                  v-html="item.iconSvg"
                  class="size-5.5"
                  :class="item.iconColor || 'text-white'"
                  fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                />
              </div>

              <!-- Si está inactivo normal -->
              <div
                v-else
                class="size-10 rounded-full flex items-center justify-center bg-white/10 dark:bg-[#1e2330] hover:bg-white/20 dark:hover:bg-[#282f40] transition-all shadow-sm"
              >
                <svg
                  v-html="item.iconSvg"
                  class="size-5.5 transition-transform group-hover:scale-110"
                  :class="item.iconColor || 'text-white'"
                  fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                />
              </div>
            </button>

            <!-- Popover flotante en modo colapsado (Táctil y ratón) -->
            <div
              class="absolute left-full top-0 ml-3.5 w-60
                     bg-white/98 dark:bg-oscuro backdrop-blur-2xl
                     border border-slate-200/90 dark:border-white/15 rounded-2xl
                     shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.7)]
                     p-3 transition-all duration-150 ease-out origin-top-left z-50"
              :class="[
                activeCollapsedGroup === item.id
                  ? 'opacity-100 visible scale-100 pointer-events-auto'
                  : 'opacity-0 invisible scale-95 pointer-events-none'
              ]"
            >
              <!-- Puente invisible para mantener la conexión hover -->
              <div class="absolute -left-4 inset-y-0 w-4"></div>

              <!-- Cabecera del popover -->
              <div class="px-2.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--color-verde-cope)] border-b border-slate-100 dark:border-white/10 mb-2 flex items-center justify-between">
                <span>{{ item.label }}</span>
                <span class="size-1.5 rounded-full bg-[var(--color-verde-cope)] shadow-[0_0_6px_var(--color-verde-cope)]"></span>
              </div>

              <div class="space-y-1">
                <RouterLink
                  v-for="child in item.children"
                  :key="child.route"
                  :to="child.route"
                  @click="handleItemClick"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer group/popchild"
                  :class="isActive(child.route)
                    ? 'bg-[var(--color-verde-cope)]/10 text-[var(--color-verde-cope)] border border-[var(--color-verde-cope)]/20 font-bold dark:bg-white/10 dark:text-white dark:border-white/15'
                    : 'text-slate-600 hover:text-[var(--color-azul-cope)] hover:bg-slate-100/90 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'"
                >
                  <!-- Flecha indicadora activa o punto -->
                  <span
                    v-if="isActive(child.route)"
                    class="flex items-center justify-center shrink-0 size-3.5 text-[var(--color-verde-cope)]"
                  >
                    <svg class="size-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                  <span
                    v-else
                    class="size-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-500 group-hover/popchild:bg-[var(--color-verde-cope)] transition-colors"
                  />

                  <!-- Texto con subrayado degradado progresivo de 0 a 100% en hover -->
                  <span class="relative pb-0.5 inline-block truncate">
                    {{ child.label }}
                    <span
                      class="absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-[var(--color-mar-cope)] to-[var(--color-verde-cope)] shadow-[0_0_6px_var(--color-verde-cope)] w-0 group-hover/popchild:w-full transition-all duration-300 ease-out opacity-0 group-hover/popchild:opacity-100 pointer-events-none"
                    ></span>
                  </span>
                </RouterLink>
              </div>

              <!-- Flecha del popover -->
              <div class="absolute top-4 -left-1.5 size-3 bg-white border-l border-b border-slate-200/90 dark:bg-oscuro dark:border-white/15 transform rotate-45"></div>
            </div>
          </div>

        </template>
      </template>

    </nav>

    <!-- PIE / CRÉDITOS -->
    <div class="p-3 mt-auto border-t border-white/10 dark:border-transparent dark:border-t-0 shrink-0">
      <div v-if="!layoutStore.isCollapsed" class="fade-in text-center">
        <p class="text-[10px] font-medium text-white/50 mb-0.5">Diseñado por</p>
        <p class="text-xs font-bold text-white/90 tracking-wide">
          Ema Informática <span class="text-[#0090e7] font-black">2026</span>
        </p>
      </div>
      <div v-else class="flex justify-center fade-in">
        <span class="size-2 rounded-full bg-[#0090e7] cursor-help shadow-[0_0_6px_#0090e7]" title="Área de Informática 2025"></span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { getAvatarUrl } from '@/utils/imageUtils'

const route = useRoute()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const openGroups = ref<string[]>([])
const activeCollapsedGroup = ref<string | null>(null)
const isUserMenuOpen = ref(false)

// Datos del usuario logueado
const userName = computed(() => authStore.user?.name || "Usuario")
const userRole = computed(() => {
  if (authStore.user?.roles && authStore.user.roles.length > 0) {
    return authStore.user.roles[0]
  }
  return authStore.user?.role || authStore.user?.agencia?.nombre || 'Administrador'
})
const userPhoto = computed(() => getAvatarUrl(authStore.user?.avatar) || null)
const userInitials = computed(() => (userName.value || "U").substring(0, 2).toUpperCase())

const handleReturnToMother = () => {
  isUserMenuOpen.value = false
  authStore.logoutLocal()
  window.location.href = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
}

const closeAllPopovers = () => {
  activeCollapsedGroup.value = null
  isUserMenuOpen.value = false
}

// Cerrar en móvil / colapsado al seleccionar una opción
const handleItemClick = () => {
  closeAllPopovers()
  if (window.innerWidth < 768) {
    layoutStore.closeSidebar()
  }
}

// Menú de opciones del sistema con iconos originales
const menuItems = computed(() => {
  const items = [
    {
      id: 'home',
      label: 'Dashboard',
      route: '/admin/dashboard',
      iconColor: 'text-cyan-400',
      iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2v10a1 1 0 01-1 1h-3m-4 0h4" />',
      show: true
    },
    {
      id: 'ejemplo-base-grupo',
      label: 'Ejemplo Grupo',
      iconColor: 'text-emerald-400',
      iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />',
      show: true,
      children: [
        { label: 'Menu de Opción A', route: '/admin/dashboard#opcion-a' },
        { label: 'Menu de Opción B', route: '/admin/dashboard#opcion-b' }
      ]
    }
  ]

  return items.filter(item => item.show)
})

// Validación de ruta activa estricta e independiente
const isActive = (path: string) => {
  if (!path) return false
  const [base, hash] = path.split('#')
  const expectedHash = hash ? `#${hash}` : ''
  const currentHash = route.hash || ''

  // 1. Debe coincidir el path base exacto
  if (route.path !== base) {
    return false
  }

  // 2. Si el ítem del menú tiene hash (ej: #buttons), la ruta debe tener exactamente ese hash
  if (expectedHash) {
    return currentHash === expectedHash
  }

  // 3. Si el ítem NO tiene hash (como Dashboard), solo está activo si la URL actual NO tiene hash
  return currentHash === ''
}

const isGroupActive = (item: any) => {
  if (!item.children) return false
  return item.children.some((child: any) => isActive(child.route))
}

// Abrir automáticamente el grupo padre si alguna opción hija está activa
watch(
  () => route.fullPath,
  () => {
    closeAllPopovers()
    const activeGroup = menuItems.value.find(item => isGroupActive(item))
    if (activeGroup && !openGroups.value.includes(activeGroup.id)) {
      openGroups.value = [activeGroup.id]
    }
  },
  { immediate: true }
)

// Resetear grupo colapsado activo al alternar el modo contraído/expandido
watch(
  () => layoutStore.isCollapsed,
  () => {
    closeAllPopovers()
  }
)

// Gestión de clic/toque en grupo (soporta pantallas táctiles y escritorio)
const handleGroupClick = (id: string) => {
  if (layoutStore.isCollapsed) {
    activeCollapsedGroup.value = activeCollapsedGroup.value === id ? null : id
    return
  }
  if (openGroups.value.includes(id)) {
    openGroups.value = []
  } else {
    openGroups.value = [id]
  }
}

const sidebarRef = ref<HTMLElement | null>(null)

// Cerrar popovers y menús con tecla Escape
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAllPopovers()
  }
}

// Cerrar popovers y menús al hacer clic fuera del sidebar
const handleDocumentClick = (e: MouseEvent) => {
  if (sidebarRef.value && !sidebarRef.value.contains(e.target as Node)) {
    closeAllPopovers()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', handleDocumentClick)
  if (!authStore.user) {
    await authStore.checkAuth()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.custom-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
