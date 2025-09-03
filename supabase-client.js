// supabase-client.js

// Importa a função para criar o cliente do CDN do Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Suas credenciais do Supabase
const SUPABASE_URL = 'https://qnxvprptwczutzojjyve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio';

// Cria e exporta a instância do cliente Supabase para ser usada em outros arquivos
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
