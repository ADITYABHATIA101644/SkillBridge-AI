import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// pdfjs-dist v5+/v6 ships modern syntax (top-level await etc.) -> needs an esnext target.
export default defineConfig({plugins:[react()],optimizeDeps:{exclude:['pdfjs-dist'],esbuildOptions:{target:'esnext'}},build:{target:'esnext'}});
