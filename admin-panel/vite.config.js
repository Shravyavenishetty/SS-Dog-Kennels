import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: "/SS-Dog-Kennels/admin-panel/",
    plugins: [react()],
    server: {
        port: 5174,
    },
})
