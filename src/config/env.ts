function requireEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". Copy .env.example to .env.local and fill it in.`,
    )
  }
  return value
}

export const env = {
  SUPABASE_URL: requireEnv(
    'VITE_SUPABASE_URL',
    import.meta.env.VITE_SUPABASE_URL,
  ),
  SUPABASE_ANON_KEY: requireEnv(
    'VITE_SUPABASE_ANON_KEY',
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  ),
}
