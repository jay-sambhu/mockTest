export function trackPage(path: string) {
  // Placeholder: replace with real analytics provider (e.g., Plausible, Vercel Analytics)
  if (typeof window !== 'undefined') {
    console.log('Analytics - page view:', path);
    // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ path }) });
  }
}
