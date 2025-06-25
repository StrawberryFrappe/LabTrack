// Utility for CSV/Excel import/export
// Uses papaparse for CSV and exceljs for Excel (secure replacement for xlsx)
// The game
import Papa from 'papaparse'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export function exportToCSV(data, filename = 'compounds.csv') {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function exportToExcel(data, filename = 'compounds.xlsx') {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Compounds')
  
  // Add header row from first data object keys
  if (data.length > 0) {
    const headers = Object.keys(data[0])
    worksheet.addRow(headers)
    
    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    }
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => item[header])
      worksheet.addRow(row)
    })
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(12, Math.min(30, column.header?.length + 5))
    })
  }
  
  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function importFromCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err)
    })
  })
}

export async function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(e.target.result)
        
        // Get first worksheet
        const worksheet = workbook.worksheets[0]
        if (!worksheet) {
          reject(new Error('No worksheets found in Excel file'))
          return
        }
        
        // Convert to JSON
        const jsonData = []
        const headers = []
        
        // Get headers from first row
        const firstRow = worksheet.getRow(1)
        firstRow.eachCell((cell, colNumber) => {
          headers[colNumber] = cell.value?.toString() || `Column${colNumber}`
        })
        
        // Process data rows (starting from row 2)
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return // Skip header row
          
          const rowData = {}
          row.eachCell((cell, colNumber) => {
            const headerName = headers[colNumber]
            if (headerName) {
              // Handle different cell value types
              let cellValue = cell.value
              if (cellValue && typeof cellValue === 'object' && cellValue.text) {
                cellValue = cellValue.text // Handle rich text
              }
              rowData[headerName] = cellValue
            }
          })
          
          // Only add row if it has some data
          if (Object.values(rowData).some(value => value !== null && value !== undefined && value !== '')) {
            jsonData.push(rowData)
          }
        })
        
        resolve(jsonData)
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Export Compounds with Save As Dialog
 * 
 * Enhanced export function that provides a proper "Save As..." dialog
 * for users to choose filename and location while maintaining Excel format.
 */
export const exportCompounds = async (compounds, filename = null) => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Compounds')

    // Define headers for compound data
    const headers = [
      'Name',
      'CAS Number', 
      'Supplier',
      'Location',
      'Quantity',
      'Unit',
      'Expiration Date',
      'Hazard Classes',
      'Threshold',
      'Notes'
    ]

    // Add headers to worksheet
    worksheet.addRow(headers)

    // Style the header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // Add data rows
    compounds.forEach(compound => {
      worksheet.addRow([
        compound.name || '',
        compound.casNumber || '',
        compound.supplier || '',
        compound.location || '',
        compound.quantity || '',
        compound.unit || '',
        compound.expirationDate || compound.expiryDate || '',
        Array.isArray(compound.hazardClasses) ? compound.hazardClasses.join(', ') : 
          (compound.hazardClass ? compound.hazardClass : ''),
        compound.threshold || '',
        compound.notes || ''
      ])
    })

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(column.width || 0, 15)
    })

    // Generate filename if not provided
    const defaultFilename = filename || `LabTrack_Compounds_${new Date().toISOString().slice(0, 10)}.xlsx`

    // Generate buffer and trigger save dialog
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    // Use the modern File System Access API if available, fallback to FileSaver
    if ('showSaveFilePicker' in window) {
      // Modern browsers with File System Access API
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: defaultFilename,
          types: [{
            description: 'Excel files',
            accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
          }]
        })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error saving file:', err)
          // Fallback to FileSaver if File System Access fails
          saveAs(blob, defaultFilename)
        }
      }
    } else {
      // Fallback for older browsers - still shows save dialog
      saveAs(blob, defaultFilename)
    }

    return true
  } catch (error) {
    console.error('Export failed:', error)
    throw new Error('Failed to export compounds')
  }
}
