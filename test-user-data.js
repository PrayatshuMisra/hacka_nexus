// Test script to check user data in database
const { createClient } = require('@supabase/supabase-js')

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUserData() {
  console.log('🔍 Testing user data for registration number: 240962386')
  
  try {
    // Test 1: Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('registration_number', '240962386')
      .single()
    
    if (error) {
      console.error('❌ Error fetching user:', error)
      return
    }
    
    if (!user) {
      console.log('❌ User not found in database')
      return
    }
    
    console.log('✅ User found:', user)
    
    // Test 2: Check if user has required fields
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
      console.log('✅ User profile is complete')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testUserData() 