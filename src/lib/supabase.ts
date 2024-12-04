import { createClient } from '@supabase/supabase-js';
import type { Moment, MomentInput } from '../types/moments';

const supabaseUrl = 'https://ykpwqxmwqvxlcfvhpwsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcHdxeG13cXZ4bGNmdmhwd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjQwMDAsImV4cCI6MjAyNTQwMDAwMH0.S_4MzXW8mFmYwPEgXDlgDNxZjqGxLvZVQJYOQBYGEYw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getMoments(): Promise<Moment[]> {
  const { data, error } = await supabase
    .from('moments')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  const moment = {
    text,
    timestamp: Date.now(),
    likes: 0,
    weather
  };

  const { data, error } = await supabase
    .from('moments')
    .insert([moment])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function likeMoment(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_likes', { moment_id: id });
  if (error) throw error;
}

export async function deleteMoment(id: string): Promise<void> {
  const { error } = await supabase
    .from('moments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}