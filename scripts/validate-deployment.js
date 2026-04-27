#!/usr/bin/env node

/**
 * Pre-deployment Validation Script
 * Checks for critical errors before updating cache version
 */

const fs = require('fs');
const path = require('path');

const CRITICAL_FILES = [
  'index.html',
  'styles.css',
  'main.js',
  'sw.js',
  'manifest.json'
];

const REQUIRED_HTML_TAGS = [
  '<html',
  '<head',
  '<body',
  '<title'
];

const REQUIRED_JS_PATTERNS = [
  'serviceWorker',
  'DOMContentLoaded'
];

let errors = [];
let warnings = [];

console.log('🔍 Starting Pre-Deployment Validation...\n');

// 1. Check if all critical files exist
console.log('1️⃣ Checking critical files exist...');
CRITICAL_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    errors.push(`❌ Critical file missing: ${file}`);
  } else {
    console.log(`   ✅ ${file} exists`);
  }
});

// 2. Validate HTML files
console.log('\n2️⃣ Validating HTML files...');
const htmlFiles = [
  'index.html',
  'about.html',
  'packages.html',
  'destinations.html',
  'services.html',
  'blog.html',
  'contact.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    let fileErrors = false;

    // Check for required tags
    REQUIRED_HTML_TAGS.forEach(tag => {
      if (!content.includes(tag)) {
        errors.push(`❌ ${file}: Missing required tag "${tag}"`);
        fileErrors = true;
      }
    });

    // Check for unclosed tags
    const openDivs = (content.match(/<div/g) || []).length;
    const closeDivs = (content.match(/<\/div>/g) || []).length;
    if (openDivs !== closeDivs) {
      errors.push(`❌ ${file}: Mismatched <div> tags (${openDivs} open, ${closeDivs} close)`);
      fileErrors = true;
    }

    // Check for syntax errors
    if (content.includes('<<') || content.includes('>>')) {
      errors.push(`❌ ${file}: Possible syntax error detected`);
      fileErrors = true;
    }

    if (!fileErrors) {
      console.log(`   ✅ ${file} is valid`);
    }
  }
});

// 3. Validate CSS
console.log('\n3️⃣ Validating CSS...');
const cssPath = path.join(__dirname, '..', 'styles.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Check for balanced braces
  const openBraces = (cssContent.match(/{/g) || []).length;
  const closeBraces = (cssContent.match(/}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    errors.push(`❌ styles.css: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
  } else {
    console.log('   ✅ styles.css braces are balanced');
  }

  // Check for common CSS errors
  if (cssContent.includes('::')) {
    console.log('   ⚠️  styles.css contains pseudo-elements (check if intentional)');
  }
} else {
  errors.push('❌ styles.css not found');
}

// 4. Validate JavaScript
console.log('\n4️⃣ Validating main.js...');
const jsPath = path.join(__dirname, '..', 'main.js');
if (fs.existsSync(jsPath)) {
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  
  // Check for required patterns
  let hasErrors = false;
  REQUIRED_JS_PATTERNS.forEach(pattern => {
    if (!jsContent.includes(pattern)) {
      warnings.push(`⚠️  main.js: Missing expected pattern "${pattern}"`);
    }
  });

  // Check for balanced braces
  const jsOpenBraces = (jsContent.match(/{/g) || []).length;
  const jsCloseBraces = (jsContent.match(/}/g) || []).length;
  
  if (jsOpenBraces !== jsCloseBraces) {
    errors.push(`❌ main.js: Mismatched braces (${jsOpenBraces} open, ${jsCloseBraces} close)`);
  } else {
    console.log('   ✅ main.js braces are balanced');
  }

  // Check for console.log in production
  const consoleLogs = (jsContent.match(/console\.log/g) || []).length;
  if (consoleLogs > 0) {
    warnings.push(`⚠️  main.js: Contains ${consoleLogs} console.log statements (consider removing for production)`);
  }
} else {
  errors.push('❌ main.js not found');
}

// 5. Validate sw.js
console.log('\n5️⃣ Validating sw.js (Service Worker)...');
const swPath = path.join(__dirname, '..', 'sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  // Check for CACHE_NAME
  if (!swContent.includes('CACHE_NAME')) {
    errors.push('❌ sw.js: Missing CACHE_NAME variable');
  } else {
    const cacheMatch = swContent.match(/const CACHE_NAME = "([^"]+)"/);
    if (cacheMatch) {
      console.log(`   ✅ CACHE_NAME found: "${cacheMatch[1]}"`);
    }
  }

  // Check for install event
  if (!swContent.includes('install')) {
    errors.push('❌ sw.js: Missing install event listener');
  } else {
    console.log('   ✅ Install event listener present');
  }

  // Check for activate event
  if (!swContent.includes('activate')) {
    errors.push('❌ sw.js: Missing activate event listener');
  } else {
    console.log('   ✅ Activate event listener present');
  }

  // Check for fetch event
  if (!swContent.includes('fetch')) {
    errors.push('❌ sw.js: Missing fetch event listener');
  } else {
    console.log('   ✅ Fetch event listener present');
  }
} else {
  errors.push('❌ sw.js not found');
}

// 6. Validate manifest.json
console.log('\n6️⃣ Validating manifest.json...');
const manifestPath = path.join(__dirname, '..', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    JSON.parse(manifestContent);
    console.log('   ✅ manifest.json is valid JSON');
  } catch (e) {
    errors.push(`❌ manifest.json: Invalid JSON - ${e.message}`);
  }
} else {
  errors.push('❌ manifest.json not found');
}

// 7. Check file sizes
console.log('\n7️⃣ Checking file sizes...');
CRITICAL_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    if (stats.size === 0) {
      errors.push(`❌ ${file}: File is empty (0 bytes)`);
    } else if (stats.size > 1000000) {
      warnings.push(`⚠️  ${file}: Large file (${sizeKB}KB) - may impact performance`);
    } else {
      console.log(`   ✅ ${file}: ${sizeKB}KB`);
    }
  }
});

// 8. Check for common mistakes
console.log('\n8️⃣ Checking for common mistakes...');
const allHtmlContent = htmlFiles
  .map(f => {
    const filePath = path.join(__dirname, '..', f);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  })
  .join('');

// Check for unescaped quotes
if (allHtmlContent.includes('href="') && allHtmlContent.includes("href='")) {
  console.log('   ✅ Mixed quote styles detected (if intentional)');
}

// Check for broken image paths
const imgSources = allHtmlContent.match(/src="([^"]+)"/g) || [];
const brokenImages = imgSources.filter(src => src.includes('//') && !src.includes('https://'));
if (brokenImages.length > 0) {
  warnings.push(`⚠️  Found ${brokenImages.length} potential image path issues`);
}

// Final Report
console.log('\n' + '='.repeat(60));
console.log('📋 VALIDATION REPORT');
console.log('='.repeat(60));

if (errors.length > 0) {
  console.log('\n❌ ERRORS FOUND:');
  errors.forEach(error => console.log('   ' + error));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(warning => console.log('   ' + warning));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ ALL VALIDATIONS PASSED!');
}

console.log('\n' + '='.repeat(60));

// Exit with error code if there are critical errors
if (errors.length > 0) {
  console.error('\n🚫 DEPLOYMENT BLOCKED: Fix errors above before deploying');
  process.exit(1);
} else {
  console.log('\n✅ SAFE TO DEPLOY');
  process.exit(0);
}
