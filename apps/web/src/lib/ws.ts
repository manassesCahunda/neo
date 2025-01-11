'use server';

import { supabaseAdmin } from '@neo/supabase';

export function listenForInsert(callback) {
  const realtimeSubscription = supabaseAdmin
    .from('messages')
    .on('INSERT', (payload) => {
      console.log('Novo registro inserido:', payload);
      callback(payload.new);
    })
    .on('ERROR', (error) => {
      console.error('Erro no Realtime:', error);
    })
    .subscribe();

  return () => realtimeSubscription.unsubscribe();
}
a