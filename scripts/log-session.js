/**
 * Session Log Script
 * 
 * Run this at the END of each AI session to log progress.
 * 
 * Usage: node scripts/log-session.js "<summary>" <calculators-added>
 * Example: node scripts/log-session.js "Added 10 math calculators from percentages section" 10
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = path.join(__dirname, '../calculator-registry.json');

function logSession(summary, count) {
    console.log(`\n📊 Logging session...\n`);

    let registry;
    if (fs.existsSync(REGISTRY_FILE)) {
        registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
    } else {
        console.error('❌ Registry file not found');
        process.exit(1);
    }

    // Create session entry
    const session = {
        date: new Date().toISOString(),
        summary: summary,
        calculatorsAdded: parseInt(count) || 0,
        lastCalculatorId: registry.metadata.lastAddedId
    };

    // Add to sessions array
    if (!registry.sessions) {
        registry.sessions = [];
    }
    registry.sessions.push(session);

    // Save
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));

    console.log(`✅ Session logged successfully`);
    console.log(`   - Summary: ${summary}`);
    console.log(`   - Calculators added: ${count}`);
    console.log(`   - Total sessions recorded: ${registry.sessions.length}`);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node scripts/log-session.js "<summary>" <calculators-added>');
    console.log('Example: node scripts/log-session.js "Added 10 math calculators" 10');
    process.exit(1);
}

logSession(args[0], args[1]);
