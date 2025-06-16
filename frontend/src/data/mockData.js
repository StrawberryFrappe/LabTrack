// Mock data for the lab inventory system
// TODO: Replace all mock data with real API calls
// TODO: Add more comprehensive test data for development
// TODO: Implement data factories for generating test data
// TODO: Add mock API responses for error scenarios

export const compounds = [
  {
    id: "1",
    name: "Sodium Chloride",
    casNumber: "7647-14-5",
    quantity: 250,
    threshold: 500,
    unit: "g",
    location: "Cabinet A-3",
    expiryDate: "2025-12-31",
    hazardClass: "Non-hazardous",
    supplier: "Sigma-Aldrich",
    batchNumber: "BATCH-2023-001",
    receivedDate: "2023-01-15",
    synonyms: "Table salt, Halite, Rock salt",
  },
  {
    id: "2",
    name: "Ethanol",
    casNumber: "64-17-5",
    quantity: 750,
    threshold: 1000,
    unit: "ml",
    location: "Flammables Cabinet F-1",
    expiryDate: "2024-06-15",
    hazardClass: "Flammable",
    supplier: "Fisher Scientific",
    batchNumber: "BATCH-2023-042",
    receivedDate: "2023-02-10",
    synonyms: "Ethyl alcohol, Drinking alcohol, EtOH",
  },
  {
    id: "3",
    name: "Hydrochloric Acid",
    casNumber: "7647-01-0",
    quantity: 100,
    threshold: 250,
    unit: "ml",
    location: "Acids Cabinet C-2",
    expiryDate: "2024-09-30",
    hazardClass: "Corrosive",
    supplier: "Merck",
    batchNumber: "BATCH-2023-103",
    receivedDate: "2023-03-22",
    synonyms: "Muriatic acid, Chlorhydric acid, HCl",
  },
  {
    id: "4",
    name: "Acetone",
    casNumber: "67-64-1",
    quantity: 500,
    threshold: 300,
    unit: "ml",
    location: "Solvents Cabinet S-1",
    expiryDate: "2024-11-20",
    hazardClass: "Flammable",
    supplier: "VWR",
    batchNumber: "BATCH-2023-078",
    receivedDate: "2023-04-05",
    synonyms: "Propanone, Dimethyl ketone",
  },
  {
    id: "5",
    name: "Methanol",
    casNumber: "67-56-1",
    quantity: 50,
    threshold: 200,
    unit: "ml",
    location: "Flammables Cabinet F-1",
    expiryDate: "2024-08-12",
    hazardClass: "Toxic, Flammable",
    supplier: "Sigma-Aldrich",
    batchNumber: "BATCH-2023-055",
    receivedDate: "2023-03-18",
    synonyms: "Methyl alcohol, Wood alcohol, MeOH",
  },
  {
    id: "6",
    name: "Potassium Hydroxide",
    casNumber: "1310-58-3",
    quantity: 150,
    threshold: 100,
    unit: "g",
    location: "Bases Cabinet B-1",
    expiryDate: "2025-05-10",
    hazardClass: "Corrosive",
    supplier: "Fisher Scientific",
    batchNumber: "BATCH-2023-089",
    receivedDate: "2023-05-02",
    synonyms: "Caustic potash, Potash lye, KOH",
  },
  {
    id: "7",
    name: "Benzene",
    casNumber: "71-43-2",
    quantity: 25,
    threshold: 100,
    unit: "ml",
    location: "Carcinogens Cabinet CC-1",
    expiryDate: "2024-07-22",
    hazardClass: "Carcinogenic, Flammable",
    supplier: "Merck",
    batchNumber: "BATCH-2023-012",
    receivedDate: "2023-01-30",
    synonyms: "Benzol, Phenyl hydride",
  },
  {
    id: "8",
    name: "Sulfuric Acid",
    casNumber: "7664-93-9",
    quantity: 300,
    threshold: 200,
    unit: "ml",
    location: "Acids Cabinet C-2",
    expiryDate: "2025-03-15",
    hazardClass: "Corrosive",
    supplier: "VWR",
    batchNumber: "BATCH-2023-067",
    receivedDate: "2023-04-12",
    synonyms: "Oil of vitriol, Battery acid, H2SO4",
  }
];

// TODO: Add more mock data for comprehensive testing
// TODO: Add mock users data
export const mockUsers = [
  // TODO: Implement user roles and permissions
];

// TODO: Add mock locations/storage areas
export const mockLocations = [
  // TODO: Implement hierarchical location structure
];

// TODO: Add mock suppliers
export const mockSuppliers = [
  // TODO: Implement supplier contact information and catalogs
];

// TODO: Add mock audit trail data
export const mockAuditTrail = [
  // TODO: Implement activity tracking
];

// TODO: Add mock notifications
export const mockNotifications = [
  // TODO: Implement notification system
];

export const countSessions = [
  {
    id: "1",
    name: "Monthly Count - January 2024",
    description: "Monthly inventory count for all chemicals",
    location: "Main Lab",
    createdBy: "John Doe",
    startDate: "2024-01-15",
    completedDate: "2024-01-16",
    completed: true,
    countedItems: 45,
    totalItems: 50,
    duration: "2 hours",
    notes: "Found 3 expired chemicals that need disposal"
  },
  {
    id: "2",
    name: "Acids Cabinet Audit",
    description: "Quarterly audit of acids cabinet",
    location: "Cabinet C-2",
    createdBy: "Jane Smith",
    startDate: "2024-02-01",
    completedDate: null,
    completed: false,
    countedItems: 8,
    totalItems: 12,
    duration: "30 minutes",
    notes: "In progress - needs completion"
  }
];

// TODO: Add mock dashboard statistics
export const mockDashboardStats = {
  // TODO: Implement real-time statistics
  totalValue: 0,
  totalWeight: 0,
  averageAge: 0,
  // TODO: Add more meaningful metrics
};

// TODO: Add mock barcode data
export const mockBarcodes = [
  // TODO: Implement barcode generation and tracking
];

// TODO: Add mock safety data sheets
export const mockSDS = [
  // TODO: Implement SDS management
];

// TODO: Add mock disposal records
export const mockDisposalRecords = [
  // TODO: Implement waste disposal tracking
];

// TODO: Add mock purchase orders
export const mockPurchaseOrders = [
  // TODO: Implement procurement tracking
];

// TODO: Add mock temperature logs
export const mockTemperatureLogs = [
  // TODO: Implement environmental monitoring
];
