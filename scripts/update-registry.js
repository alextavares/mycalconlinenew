/**
 * Update Registry Script
 * 
 * Run this AFTER successfully adding a new calculator to update the registry.
 * 
 * Usage: node scripts/update-registry.js <calculator-id> <category> [source]
 * Example: node scripts/update-registry.js compound-interest finance omni
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = path.join(__dirname, '../calculator-registry.json');

function updateRegistry(id, category, source = 'omni') {
    console.log(`\n📝 Updating registry for: "${id}"\n`);

    let registry;
    if (fs.existsSync(REGISTRY_FILE)) {
        registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
    } else {
        console.error('❌ Registry file not found');
        process.exit(1);
    }

    // Add calculator to registry
    registry.calculators[id] = {
        status: 'done',
        category: category,
        source: source,
        addedOn: new Date().toISOString().split('T')[0]
    };

    // Update metadata
    registry.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    registry.metadata.totalCalculators = Object.keys(registry.calculators).length + 671; // Base calculators
    registry.metadata.lastAddedId = id;
    registry.metadata.lastAddedCategory = category;

    // Update category progress
    if (registry.metadata.omniProgress[category]) {
        registry.metadata.omniProgress[category].completed += 1;
        registry.metadata.omniProgress[category].status = 'in_progress';
    }

    // Save
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));

    console.log(`✅ Registry updated successfully`);
    console.log(`   - ID: ${id}`);
    console.log(`   - Category: ${category}`);
    console.log(`   - Total calculators: ${registry.metadata.totalCalculators}`);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node scripts/update-registry.js <calculator-id> <category> [source]');
    console.log('Example: node scripts/update-registry.js compound-interest finance omni');
    process.exit(1);
}

updateRegistry(args[0], args[1], args[2]);
