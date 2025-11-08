// Simulate browser environment
global.window = {};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Supabase in browser-like environment...');
console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBrowserConnection() {
  try {
    console.log('🔗 Testing Supabase connection from browser context...');
    
    // Test the exact query that loginStudentDirectly uses
    const { data: student, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .eq('registration_number', '240962386')
      .single();
    
    console.log('🔍 Query result:', { student, error });
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    if (student) {
      console.log('✅ Student found:', {
        id: student.id,
        registration_number: student.registration_number,
        email: student.email,
        full_name: student.full_name,
        role: student.role
      });
    } else {
      console.log('❌ Student not found');
    }
  } catch (err) {
    console.error('❌ Connection error:', err);
  }
}

testBrowserConnection(); 