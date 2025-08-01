// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://lxamsbjtghbjoyowxntp.supabase.co'        
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YW1zYmp0Z2hiam95b3d4bnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzI0NjAsImV4cCI6MjA2OTU0ODQ2MH0.gOsMfdF02oAPTKL5cM7y-X1inG-212M8Gr7hw4U2TCA'          // استبدليه بمفتاحك

export const supabase = createClient(supabaseUrl, supabaseKey)
