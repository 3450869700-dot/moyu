import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oiewadumjixvrqbghczl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZXdhZHVtaml4dnJxYmdoY3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzY2OTUsImV4cCI6MjA4ODAxMjY5NX0.C-BGaqSDYCalCv7R3KCvFmuLPJS8R_D7s90wblap8Wc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)