<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg">
    <!-- Left: Items info and page size selector -->
    <div class="flex items-center gap-4">
      <!-- Items per page selector -->
      <div class="flex items-center gap-2">
        <label for="page-size" class="text-sm text-slate-600">
          {{ $t('pagination.itemsPerPage') }}:
        </label>
        <select
          id="page-size"
          :value="pageSize"
          @change="setPageSize(parseInt($event.target.value))"
          class="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option
            v-for="size in pageSizeOptions"
            :key="size"
            :value="size"
          >
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Items range display -->
      <div class="text-sm text-slate-600">
        <template v-if="totalItems > 0">
          {{ $t('pagination.showing') }}
          <span class="font-medium">{{ startIndex + 1 }}</span>
          {{ $t('pagination.to') }}
          <span class="font-medium">{{ Math.min(endIndex + 1, totalItems) }}</span>
          {{ $t('pagination.of') }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ $t('pagination.results') }}
        </template>
        <template v-else>
          {{ $t('pagination.noResults') }}
        </template>
      </div>
    </div>

    <!-- Right: Navigation controls -->
    <div class="flex items-center gap-2">
      <!-- First page button -->
      <button
        @click="firstPage"
        :disabled="isFirstPage || totalItems === 0"
        :title="$t('pagination.firstPage')"
        class="px-2 py-1 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 rounded transition-colors"
        :class="{ 'cursor-not-allowed opacity-50': isFirstPage || totalItems === 0 }"
      >
        ⟨⟨
      </button>

      <!-- Previous page button -->
      <button
        @click="prevPage"
        :disabled="!hasPrevPage || totalItems === 0"
        :title="$t('pagination.previousPage')"
        class="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 rounded transition-colors"
        :class="{ 'cursor-not-allowed opacity-50': !hasPrevPage || totalItems === 0 }"
      >
        {{ $t('pagination.previous') }}
      </button>

      <!-- Page numbers -->
      <div class="flex items-center gap-1" v-if="totalPages > 1">
        <!-- Show ellipsis if there are pages before visible range -->
        <span v-if="getPageNumbers()[0] > 1" class="px-2 py-1 text-slate-400">...</span>
        
        <button
          v-for="page in getPageNumbers()"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>
        
        <!-- Show ellipsis if there are pages after visible range -->
        <span v-if="getPageNumbers()[getPageNumbers().length - 1] < totalPages" class="px-2 py-1 text-slate-400">...</span>
      </div>

      <!-- Direct page input for large page counts -->
      <div v-if="totalPages > 10" class="flex items-center gap-2 ml-2">
        <label for="page-input" class="text-sm text-slate-600">
          {{ $t('pagination.goToPage') }}:
        </label>
        <input
          id="page-input"
          type="number"
          :min="1"
          :max="totalPages"
          :value="currentPage"
          @keyup.enter="handlePageInput($event)"
          @blur="handlePageInput($event)"
          class="w-16 px-2 py-1 text-sm text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Next page button -->
      <button
        @click="nextPage"
        :disabled="!hasNextPage || totalItems === 0"
        :title="$t('pagination.nextPage')"
        class="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 rounded transition-colors"
        :class="{ 'cursor-not-allowed opacity-50': !hasNextPage || totalItems === 0 }"
      >
        {{ $t('pagination.next') }}
      </button>

      <!-- Last page button -->
      <button
        @click="lastPage"
        :disabled="isLastPage || totalItems === 0"
        :title="$t('pagination.lastPage')"
        class="px-2 py-1 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 rounded transition-colors"
        :class="{ 'cursor-not-allowed opacity-50': isLastPage || totalItems === 0 }"
      >
        ⟩⟩
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  startIndex: {
    type: Number,
    required: true
  },
  endIndex: {
    type: Number,
    required: true
  },
  hasNextPage: {
    type: Boolean,
    required: true
  },
  hasPrevPage: {
    type: Boolean,
    required: true
  },
  isFirstPage: {
    type: Boolean,
    required: true
  },
  isLastPage: {
    type: Boolean,
    required: true
  },
  pageSizeOptions: {
    type: Array,
    default: () => [5, 10, 25, 50, 100]
  }
})

const emit = defineEmits([
  'goToPage',
  'nextPage',
  'prevPage',
  'firstPage',
  'lastPage',
  'setPageSize'
])

// Method proxies
const goToPage = (page) => emit('goToPage', page)
const nextPage = () => emit('nextPage')
const prevPage = () => emit('prevPage')
const firstPage = () => emit('firstPage')
const lastPage = () => emit('lastPage')
const setPageSize = (size) => emit('setPageSize', size)

// Get visible page numbers (simplified for component)
const getPageNumbers = (maxVisible = 5) => {
  const pages = []
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

// Handle direct page input
const handlePageInput = (event) => {
  const page = parseInt(event.target.value)
  if (page >= 1 && page <= props.totalPages) {
    goToPage(page)
  } else {
    // Reset to current page if invalid
    event.target.value = props.currentPage
  }
}
</script>
