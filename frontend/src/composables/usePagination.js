/**
 * Pagination Composable
 * 
 * Provides pagination state management and navigation methods for handling
 * large datasets efficiently. Supports page size configuration and URL state persistence.
 * 
 * Features:
 * - Reactive pagination state (currentPage, pageSize, totalPages)
 * - Navigation methods (nextPage, prevPage, goToPage)
 * - Items calculation (startIndex, endIndex, visibleItems)
 * - URL state management for browser navigation
 * - Configurable page sizes with sensible defaults
 */

import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function usePagination(options = {}) {
  const {
    defaultPageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],
    urlParam = 'page',
    pageSizeParam = 'pageSize'
  } = options

  const route = useRoute()
  const router = useRouter()

  // Initialize pagination state from URL or defaults
  const currentPage = ref(parseInt(route.query[urlParam]) || 1)
  const pageSize = ref(parseInt(route.query[pageSizeParam]) || defaultPageSize)
  const totalItems = ref(0)

  // Computed properties
  const totalPages = computed(() => 
    Math.ceil(totalItems.value / pageSize.value) || 1
  )

  const startIndex = computed(() => 
    (currentPage.value - 1) * pageSize.value
  )

  const endIndex = computed(() => 
    Math.min(startIndex.value + pageSize.value - 1, totalItems.value - 1)
  )

  const hasNextPage = computed(() => 
    currentPage.value < totalPages.value
  )

  const hasPrevPage = computed(() => 
    currentPage.value > 1
  )

  const isFirstPage = computed(() => 
    currentPage.value === 1
  )

  const isLastPage = computed(() => 
    currentPage.value === totalPages.value
  )

  // Navigation methods
  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    
    currentPage.value = page
    updateUrl()
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      goToPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      goToPage(currentPage.value - 1)
    }
  }

  const firstPage = () => {
    goToPage(1)
  }

  const lastPage = () => {
    goToPage(totalPages.value)
  }

  const setPageSize = (newSize) => {
    if (!pageSizeOptions.includes(newSize)) return
    
    // Calculate new page to maintain roughly the same position
    const currentItemIndex = startIndex.value
    const newPage = Math.floor(currentItemIndex / newSize) + 1
    
    pageSize.value = newSize
    currentPage.value = Math.min(newPage, Math.ceil(totalItems.value / newSize) || 1)
    updateUrl()
  }

  const reset = () => {
    currentPage.value = 1
    updateUrl()
  }

  // Update URL with current pagination state
  const updateUrl = () => {
    const query = { ...route.query }
    
    if (currentPage.value === 1) {
      delete query[urlParam]
    } else {
      query[urlParam] = currentPage.value.toString()
    }
    
    if (pageSize.value === defaultPageSize) {
      delete query[pageSizeParam]
    } else {
      query[pageSizeParam] = pageSize.value.toString()
    }
    
    router.replace({ query })
  }

  // Watch for URL changes from browser navigation
  watch(() => route.query[urlParam], (newPage) => {
    const page = parseInt(newPage) || 1
    if (page !== currentPage.value) {
      currentPage.value = page
    }
  })

  watch(() => route.query[pageSizeParam], (newPageSize) => {
    const size = parseInt(newPageSize) || defaultPageSize
    if (size !== pageSize.value && pageSizeOptions.includes(size)) {
      pageSize.value = size
    }
  })

  // Helper to get paginated slice of items
  const getPaginatedItems = (items) => {
    if (!Array.isArray(items)) return []
    
    totalItems.value = items.length
    
    // Adjust current page if it's beyond available pages
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      updateUrl()
    }
    
    return items.slice(startIndex.value, startIndex.value + pageSize.value)
  }

  // Get page numbers for pagination controls
  const getPageNumbers = (maxVisible = 5) => {
    const pages = []
    const half = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage.value - half)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return {
    // State
    currentPage,
    pageSize,
    totalItems,
    pageSizeOptions,

    // Computed
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,

    // Methods
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    reset,
    getPaginatedItems,
    getPageNumbers
  }
}
