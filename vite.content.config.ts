import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
        emptyOutDir: false,
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/content/index.tsx'),
            name: 'GmailReplyContent',
            formats: ['iife'],
            fileName: () => 'src/content/index.js',
        },
    },
});
