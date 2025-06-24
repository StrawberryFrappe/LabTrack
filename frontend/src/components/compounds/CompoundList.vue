<template>
  <div class="space-y-6">    <!-- Toolbar with filters and actions -->
    <div class="space-y-4">
      <!-- Filters Section -->
      <CompoundFilters />      <!-- Actions Section -->
      <div class="flex items-center justify-between">
        <!-- Results summary and badges -->
        <div class="flex items-center gap-4">
          <div class="text-sm text-slate-600">
            Showing {{ filteredCompounds.length }} of {{ compounds.length }} compounds
          </div>
          
          <div class="flex gap-2">
            <Badge variant="warning" v-if="lowStockItems.length > 0">
              {{ lowStockItems.length }} Low Stock
            </Badge>
            <Badge variant="destructive" v-if="expiringItems.length > 0">
              {{ expiringItems.length }} Expiring Soon
            </Badge>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex items-center bg-slate-100 rounded-lg p-1" role="group" aria-label="View mode toggle">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
              :aria-pressed="viewMode === 'grid'"
              title="Switch to grid view"
            >
              <!-- TODO: Use proper icon component -->
              <span class="inline-flex items-center gap-1">
                ⊞ <span class="hidden sm:inline">Cards</span>
              </span>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
              :aria-pressed="viewMode === 'list'"
              title="Switch to list view"
            >
              <!-- TODO: Use proper icon component -->
              <span class="inline-flex items-center gap-1">
                ☰ <span class="hidden sm:inline">List</span>
              </span>
            </button>
          </div>          <!-- Action buttons -->
          <div class="flex gap-2">
            <Button variant="primary" @click="addModal.openForCreate()">
              Add Compound
            </Button>
            <Button variant="outline" @click="handleImportCompounds">
              Import
            </Button>
            <Button variant="outline" @click="handleExportCompounds">
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>    <!-- ✅ COMPLETED: Loading state with spinner and user feedback -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading compounds...</p>
      </div>
    </div>
    
    <!-- ✅ COMPLETED: Error state with retry functionality and user-friendly messaging -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-red-400 text-xl">⚠️</span>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading compounds</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          <button 
            @click="loadCompounds"
            class="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
      <!-- Empty state -->
    <div v-else-if="filteredCompounds.length === 0 && !loading" class="text-center py-12">
      <div class="text-slate-400 text-lg mb-2">🔍</div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No compounds found</h3>
      <p class="text-slate-500">Try adjusting your search filters.</p>
      <!-- TODO: Quick action to add first compound if none exist -->
    </div>
      <!-- Content based on view mode -->
    <div v-else-if="!loading && !error">
      <!-- Grid View (Cards) -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompoundCard
          v-for="compound in filteredCompounds"
          :key="compound.id"
          :compound="compound"
          @edit="handleEdit"
          @scan="handleScan"
          @delete="handleDelete"
        />
      </div>
      
      <!-- List View (Table) -->
      <CompoundTable
        v-else-if="viewMode === 'list'"
        :compounds="filteredCompounds"
        @edit="handleEdit"
        @scan="handleScan"
        @delete="handleDelete"
      />
    </div>
      <!-- TODO: Add pagination for large datasets -->

    <!-- Add Compound Modal -->
    <FormModal
      v-model="addModal.isOpen.value"
      title="Add New Compound"
      submit-text="Add Compound"
      :loading="addModal.loading.value"
      :errors="addModal.errors"
      :is-form-valid="addModal.isFormValid.value"
      @submit="handleAddSubmit"
      @cancel="addModal.handleCancel"
      @reset="addModal.resetForm"
    >
      <CompoundForm
        :form-data="addModal.formData"
        :errors="addModal.errors"
        @validate="addModal.setErrors"
      />
    </FormModal>

    <!-- Edit Compound Modal -->
    <FormModal
      v-model="editModal.isOpen.value"
      title="Edit Compound"
      submit-text="Save Changes"
      :loading="editModal.loading.value"
      :errors="editModal.errors"
      :is-form-valid="editModal.isFormValid.value"
      @submit="handleEditSubmit"
      @cancel="editModal.handleCancel"
      @reset="editModal.resetForm"
    >
      <CompoundForm
        :form-data="editModal.formData"
        :errors="editModal.errors"
        @validate="editModal.setErrors"
      />
    </FormModal>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-model="deleteDialog.isOpen.value"
      :title="deleteDialog.config.title"
      :message="deleteDialog.config.message"
      :type="deleteDialog.config.type"
      :loading="deleteDialog.loading.value"
      @confirm="deleteDialog.handleConfirm"
      @cancel="deleteDialog.handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CompoundCard from './CompoundCard.vue'
import CompoundTable from './CompoundTable.vue'
import CompoundFilters from './CompoundFilters.vue'
import CompoundForm from './CompoundForm.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import FormModal from '@/components/ui/FormModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useCompounds } from '@/composables/useCompounds'
import { useFormModal, useConfirmDialog } from '@/composables/useModals'
import { exportToCSV, exportToExcel, importFromCSV, importFromExcel } from '@/utils/importExport'

const { filteredCompounds, compounds, lowStockItems, expiringItems, loading, error, loadCompounds, addCompound, updateCompound, deleteCompound } = useCompounds()

// View mode state
const viewMode = ref('grid') // 'grid' or 'list'

// Modal instances
const addModal = useFormModal({
  name: '',
  casNumber: '',
  quantity: 0,
  unit: '',
  threshold: 0,
  location: '',
  hazardClass: '',
  expiryDate: '',
  receivedDate: '',
  supplier: '',
  batchNumber: '',
  synonyms: ''
})

const editModal = useFormModal()
const deleteDialog = useConfirmDialog()

defineEmits(['edit-compound', 'scan-compound'])

const handleEdit = (compound) => {
  editModal.openForEdit({ ...compound })
}

const handleDelete = async (compound) => {
  try {
    await deleteDialog.confirm({
      title: 'Delete Compound',
      message: `Are you sure you want to delete "${compound.name}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
    
    await deleteCompound(compound.id)
  } catch (error) {
    if (error !== false) { // Not a user cancellation
      console.error('Error deleting compound:', error)
    }
  }
}

const handleScan = (compound) => {
  // TODO: Implement scan functionality
  // TODO: Add compound to current inventory count session
  // TODO: If no active session, prompt to create one
  // TODO: Navigate to scanning interface for this compound
  console.log('Scan compound:', compound)
}

const handleAddSubmit = async () => {
  await addModal.handleSubmit(async (formData) => {
    await addCompound(formData)
  })
}

const handleEditSubmit = async () => {
  await editModal.handleSubmit(async (formData) => {
    await updateCompound(formData.id, formData)
  })
}

// TODO: Implement import functionality
const handleImportCompounds = async () => {
  // Show file input dialog
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    let imported = []
    try {
      if (file.name.endsWith('.csv')) {
        imported = await importFromCSV(file)
      } else if (file.name.endsWith('.xlsx')) {
        imported = await importFromExcel(file)
      } else {
        alert('Unsupported file type')
        return
      }
      // TODO: Validate and merge imported data
      // For now, just log
      console.log('Imported compounds:', imported)
      // Optionally, update compounds.value here
    } catch (err) {
      alert('Import failed: ' + err.message)
    }
  }
  input.click()
}

// Show export dialog to select file type and name
const handleExportCompounds = async () => {
  // Create a modal dialog for export options
  const modal = document.createElement('dialog')
  modal.className = 'rounded-lg p-6 shadow-xl bg-white max-w-xs w-full'
  modal.innerHTML = `
    <form method="dialog" class="flex flex-col gap-4">
      <label class="text-sm font-medium">File name
        <input type="text" name="filename" value="compounds" class="border rounded px-2 py-1 w-full mt-1" required />
      </label>
      <label class="text-sm font-medium">File type
        <select name="filetype" class="border rounded px-2 py-1 w-full mt-1">
          <option value="csv">CSV (.csv)</option>
          <option value="xlsx">Excel (.xlsx)</option>
        </select>
      </label>
      <div class="flex gap-2 justify-end mt-4">
        <button type="submit" class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Export</button>
        <button type="button" class="bg-gray-200 px-4 py-1 rounded" id="cancelExport">Cancel</button>
      </div>
    </form>
  `
  document.body.appendChild(modal)
  modal.showModal()
  modal.querySelector('#cancelExport').onclick = () => modal.close()
  modal.addEventListener('close', () => document.body.removeChild(modal))
  modal.addEventListener('submit', (e) => {
    e.preventDefault()
    const form = e.target
    const filename = form.filename.value.trim() || 'compounds'
    const filetype = form.filetype.value
    if (filetype === 'csv') {
      exportToCSV(compounds.value, filename + '.csv')
    } else {
      exportToExcel(compounds.value, filename + '.xlsx')
    }
    modal.close()
  })
}

// TODO: Implement bulk operations
const handleBulkEdit = (compoundIds) => {
  // TODO: Bulk edit selected compounds
}

const handleBulkDelete = (compoundIds) => {
  // TODO: Bulk delete selected compounds with confirmation
}

const handleBulkExport = (compoundIds) => {
  // TODO: Export selected compounds to CSV/Excel
}

// TODO: Implement keyboard shortcuts for view switching (e.g., Ctrl+1 for grid, Ctrl+2 for list)
// TODO: Persist view mode preference in localStorage
// TODO: Add view mode to URL query params for sharing
</script>
