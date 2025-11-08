#!/usr/bin/env node

/**
 * Supabase Deployment Configuration Helper
 * 
 * This script helps you configure Supabase for deployment by providing
 * the correct URLs and settings you need to update in your Supabase dashboard.
 */

require('dotenv').config({ path: '.env.local' });

console.log('🚀 Supabase Deployment Configuration Helper\n');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Please make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

console.log('✅ Supabase credentials found');
console.log(`📡 Supabase URL: ${supabaseUrl}\n`);

// Get deployment URL from environment or prompt user
let deploymentUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;

if (!deploymentUrl) {
  console.log('🌐 Deployment URL Configuration');
  console.log('Please enter your deployment URL (e.g., https://your-app.vercel.app):');
  
  // In a real script, you would use readline to get user input
  // For now, we'll show the configuration needed
  deploymentUrl = 'https://your-app.vercel.app'; // Placeholder
}

if (deploymentUrl && !deploymentUrl.startsWith('https://')) {
  deploymentUrl = `https://${deploymentUrl}`;
}

console.log('\n📋 Supabase Configuration Required:\n');

console.log('1. Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard\n');

console.log('2. Select your project\n');

console.log('3. Navigate to Authentication → Settings\n');

console.log('4. Update the following settings:\n');

console.log('   📍 Site URL:');
console.log(`   Change from: http://localhost:3000`);
console.log(`   To: ${deploymentUrl}\n`);

console.log('   🔗 Redirect URLs:');
console.log(`   Add: ${deploymentUrl}/confirm-email`);
console.log(`   Add: ${deploymentUrl}/auth/callback`);
console.log(`   Add: ${deploymentUrl}/dashboard/student`);
console.log(`   Add: ${deploymentUrl}/dashboard/club`);
console.log(`   Add: ${deploymentUrl}/dashboard/admin\n`);

console.log('5. Save the changes\n');

console.log('🔧 Environment Variables for Deployment:\n');

console.log('Add these to your deployment platform (Vercel, Netlify, etc.):\n');

console.log(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`);
console.log(`NEXT_PUBLIC_BASE_URL=${deploymentUrl}\n`);

console.log('📝 Additional Notes:');
console.log('- Email confirmation links are tied to the domain where they were generated');
console.log('- You cannot use localhost links in production');
console.log('- Always test email confirmation in the target environment');
console.log('- Consider using different Supabase projects for dev/prod\n');

console.log('✅ Configuration complete!');
console.log('After updating Supabase settings, your email confirmation links will redirect to your deployed domain.'); 