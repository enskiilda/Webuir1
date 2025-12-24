import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
plugins: [react()],
resolve: {
alias: {
'$lib': path.resolve(__dirname, './src/lib')
}
},
define: {
APP_VERSION: JSON.stringify(process.env.npm_package_version),
APP_BUILD_HASH: JSON.stringify(process.env.APP_BUILD_HASH || 'dev-build')
},
build: {
sourcemap: false,
minify: false,
outDir: 'build'
},
server: {
host: '0.0.0.0',
port: 5000,
strictPort: false,
hmr: {
overlay: false
},
proxy: {
'/api': {
target: 'http://localhost:3001',
changeOrigin: true
}
}
}
});
