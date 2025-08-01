// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://extkhdyiwrpqujugxyzs.supabase.co'        
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dGtoZHlpd3JwcXVqdWd4eXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1ODcyNjgsImV4cCI6MjA2OTE2MzI2OH0.Sc6UBlqpuiQHoz7eRml_SfyvitdmfzP6B8_e8Ametvo'          // استبدليه بمفتاحك

export const supabase = createClient(supabaseUrl, supabaseKey)
