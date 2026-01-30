#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://localhost:7171';
const SWAGGER_URL = `${BACKEND_URL}/swagger/v1/swagger.json`;
const OUTPUT_DIR = path.join(__dirname, '../src/types-openapi');

async function generateTypes() {
  try {
    console.log('🚀 Starting type generation...');
    
    // Clean output directory
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
      console.log('🧹 Cleaned output directory');
    }

    // Generate TypeScript types using OpenAPI Generator
    console.log('📡 Fetching API schema and generating types...');
    
    const command = `npx @openapitools/openapi-generator-cli generate \
      -i ${SWAGGER_URL} \
      -g typescript-fetch \
      -o ${OUTPUT_DIR}/api \
      --skip-validate-spec \
      --additional-properties=typescriptThreePlus=true,withInterfaces=true,supportsES6=true,enumPropertyNaming=UPPERCASE,modelPropertyNaming=original`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ Types generated successfully!');
    console.log(`📁 Output: ${OUTPUT_DIR}`);
    
    // Create index file for easy imports
    createIndexFile();
    
  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    process.exit(1);
  }
}

function createIndexFile() {
  const indexContent = `// Auto-generated API types
export * from './api';

// Custom types
export * from '../types/api';
export * from '../types/constants';
export * from '../types/api-client';
`;

  const indexPath = path.join(OUTPUT_DIR, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log('📄 Created index file');
}

// Run if called directly
if (require.main === module) {
  generateTypes();
}

module.exports = { generateTypes };