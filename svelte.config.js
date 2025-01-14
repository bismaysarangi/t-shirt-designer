import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html' // Fallback to a single HTML file for dynamic routes
    })
  }
};
