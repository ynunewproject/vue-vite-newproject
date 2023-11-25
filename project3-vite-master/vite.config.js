/*import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//element导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
})*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://run.mocky.io', // 目标服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
