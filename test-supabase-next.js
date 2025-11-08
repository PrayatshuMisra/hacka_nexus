// Test Supabase connection using Next.js environment loading
const { createClient } = require('@supabase/supabase-js')

// Load environment variables manually for Node.js
require('dotenv').config({ path: '.env.local' })

// Check environment variables
console.log('🔍 Checking environment variables...')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test 1: Basic connection test
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return
    }
    
    console.log('✅ Supabase connection successful')
    
    // Test 2: Check if user exists
    console.log('🔍 Checking for user with registration number: 240962386')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('registration_number', '240962386')
      .single()
    
    if (userError) {
      console.error('❌ Error fetching user:', userError)
      return
    }
    
    if (!user) {
      console.log('❌ User not found in database')
      return
    }
    
    console.log('✅ User found:', {
      id: user.id,
      registration_number: user.registration_number,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      year_of_study: user.year_of_study
    })
    
    // Test 3: Check if user has required fields
    const hasFullName = !!user.full_name
    const hasEmail = !!user.email
    const hasRole = !!user.role
    
    console.log('📊 User data check:')
    console.log('  - Has full_name:', hasFullName)
    console.log('  - Has email:', hasEmail)
    console.log('  - Has role:', hasRole)
    console.log('  - Role value:', user.role)
    
    if (!hasFullName || !hasEmail) {
      console.log('⚠️ User profile is incomplete')
    } else {
      console.log('✅ User profile is complete and ready for login')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSupabaseConnection() 