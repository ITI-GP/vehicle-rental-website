// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yprsyzazojwquhpzcwsr.supabase.co'        
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwcnN5emF6b2p3cXVocHpjd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjY0NDEsImV4cCI6MjA2OTU0MjQ0MX0.gKXLIzb9CZup7S12iE0TEtQv0-Z03GsUjHS33Fa72UY'          // استبدليه بمفتاحك

export const supabase = createClient(supabaseUrl, supabaseKey)
