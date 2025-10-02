import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The variable name is correct.firebase init hosting

// NOTE: Your repository name is 'quote--' including the two dashes.


// https://vitejs.dev/config/
export default defineConfig({
    // ❌ Error was here: bas: '/$repoName}/'
    // ✅ Fix: Use 'base' and the correct template literal syntax
    base: "/react",
    plugins: [react()],
})