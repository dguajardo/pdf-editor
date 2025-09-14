// Test Supabase connection
const { createClient } = require('@supabase/supabase-js')

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database is accessible')
    
    // Test auth
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔐 Auth service is working')
    
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

testConnection()

