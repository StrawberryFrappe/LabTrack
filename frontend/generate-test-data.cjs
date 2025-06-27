const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Generate more compounds for pagination testing
const suppliers = ['Sigma-Aldrich', 'Fisher Scientific', 'VWR', 'Thermo Fisher', 'Merck', 'Fluka'];
const locations = ['Cabinet A1', 'Cabinet A2', 'Cabinet B1', 'Cabinet B2', 'Acid Cabinet', 'Base Cabinet', 'Flammables Cabinet', 'Cold Storage'];
const hazardClasses = ['Non-hazardous', 'Flammable', 'Corrosive', 'Toxic', 'Oxidizing', 'Irritant'];
const units = ['g', 'ml', 'L', 'kg'];

// Add 50 more compounds
for (let i = 10; i <= 60; i++) {
  const compound = {
    id: i.toString(),
    name: `Test Compound ${i}`,
    casNumber: `${Math.floor(Math.random() * 9999)}-${Math.floor(Math.random() * 99)}-${Math.floor(Math.random() * 9)}`,
    quantity: Math.floor(Math.random() * 1000) + 10,
    unit: units[Math.floor(Math.random() * units.length)],
    threshold: Math.floor(Math.random() * 200) + 50,
    location: locations[Math.floor(Math.random() * locations.length)],
    hazardClass: hazardClasses[Math.floor(Math.random() * hazardClasses.length)],
    expiryDate: new Date(2024 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    receivedDate: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    batchNumber: `BATCH-${new Date().getFullYear()}-${i.toString().padStart(3, '0')}`,
    synonyms: `Synonym A, Synonym B`
  };
  
  db.compounds.push(compound);
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Added test compounds for pagination testing');
