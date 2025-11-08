"use client"

import { useEffect, useState } from 'react'

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [supabaseTest, setSupabaseTest] = useState<any>({})

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'
    })

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey) {
          setSupabaseTest({ error: 'Missing environment variables' })
          return
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('registration_number', '240962386')
          .single()
        
        setSupabaseTest({ data, error })
      } catch (err) {
        setSupabaseTest({ error: err })
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Variables:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Supabase Test:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(supabaseTest, null, 2)}
        </pre>
      </div>
    </div>
  )
} 