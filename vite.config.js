import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The variable name is correct.
// NOTE: Your repository name is 'quote--' including the two dashes.
const repoName = "quote--";

// https://vitejs.dev/config/
export default defineConfig({
    // ❌ Error was here: bas: '/$repoName}/'
    // ✅ Fix: Use 'base' and the correct template literal syntax
    base: `/${repoName}/`,
    plugins: [react()],
})