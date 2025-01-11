import { createClient } from '@supabase/supabase-js';
import { env } from '@neo/env';

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_PRIVATE_KEY);

export  { supabaseAdmin };