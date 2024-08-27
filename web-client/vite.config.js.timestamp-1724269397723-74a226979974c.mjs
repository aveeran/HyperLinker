// vite.config.js
import { defineConfig } from "file:///C:/Users/Abbinash%20Ranjitkar/Desktop/Projects/HyperLinker/web-client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Abbinash%20Ranjitkar/Desktop/Projects/HyperLinker/web-client/node_modules/@vitejs/plugin-react/dist/index.mjs";

// postcss.config.js
import tailwindcss from "file:///C:/Users/Abbinash%20Ranjitkar/Desktop/Projects/HyperLinker/web-client/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/Abbinash%20Ranjitkar/Desktop/Projects/HyperLinker/web-client/node_modules/autoprefixer/lib/autoprefixer.js";
var postcss_config_default = {
  plugins: [
    tailwindcss(),
    autoprefixer()
  ]
};

// vite.config.js
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: postcss_config_default
  },
  build: {
    rollupOptions: {
      input: {
        background: "src/background/background.js",
        content: "src/content/content.js",
        index: "index.html"
      },
      output: {
        entryFileNames: "[name].js",
        // Ensures the filenames match the entry names
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  },
  publicDir: "public"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicG9zdGNzcy5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBYmJpbmFzaCBSYW5qaXRrYXJcXFxcRGVza3RvcFxcXFxQcm9qZWN0c1xcXFxIeXBlckxpbmtlclxcXFx3ZWItY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBYmJpbmFzaCBSYW5qaXRrYXJcXFxcRGVza3RvcFxcXFxQcm9qZWN0c1xcXFxIeXBlckxpbmtlclxcXFx3ZWItY2xpZW50XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9BYmJpbmFzaCUyMFJhbmppdGthci9EZXNrdG9wL1Byb2plY3RzL0h5cGVyTGlua2VyL3dlYi1jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCBwb3N0Y3NzIGZyb20gJy4vcG9zdGNzcy5jb25maWcuanMnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICdzcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLmpzJyxcclxuICAgICAgICBjb250ZW50OiAnc3JjL2NvbnRlbnQvY29udGVudC5qcycsXHJcbiAgICAgICAgaW5kZXg6ICdpbmRleC5odG1sJ1xyXG4gICAgICB9LFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsIC8vIEVuc3VyZXMgdGhlIGZpbGVuYW1lcyBtYXRjaCB0aGUgZW50cnkgbmFtZXNcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2NodW5rcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJyxcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXHJcbn0pXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWJiaW5hc2ggUmFuaml0a2FyXFxcXERlc2t0b3BcXFxcUHJvamVjdHNcXFxcSHlwZXJMaW5rZXJcXFxcd2ViLWNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWJiaW5hc2ggUmFuaml0a2FyXFxcXERlc2t0b3BcXFxcUHJvamVjdHNcXFxcSHlwZXJMaW5rZXJcXFxcd2ViLWNsaWVudFxcXFxwb3N0Y3NzLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQWJiaW5hc2glMjBSYW5qaXRrYXIvRGVza3RvcC9Qcm9qZWN0cy9IeXBlckxpbmtlci93ZWItY2xpZW50L3Bvc3Rjc3MuY29uZmlnLmpzXCI7aW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICBhdXRvcHJlZml4ZXIoKSxcclxuICBdLFxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJZLFNBQVMsb0JBQW9CO0FBQ3hhLE9BQU8sV0FBVzs7O0FDRCtYLE9BQU8saUJBQWlCO0FBQ3phLE9BQU8sa0JBQWtCO0FBRXpCLElBQU8seUJBQVE7QUFBQSxFQUNiLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxFQUNmO0FBQ0Y7OztBREhBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixLQUFLO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLFlBQVk7QUFBQSxRQUNaLFNBQVM7QUFBQSxRQUNULE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQTtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFdBQVc7QUFDYixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=