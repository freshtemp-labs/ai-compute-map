/**
 * @file main.tsx
 * @description 应用入口文件。初始化 React 18 根节点，注册 Service Worker 离线支持，
 *   加载 i18n 国际化配置和全局 CSS 样式，挂载 App 根组件到 DOM。
 * @dependencies react-dom/client, ./i18n, ./App.tsx
 */
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

// 注册 Service Worker 提供离线缓存支持（PWA）
// 注册失败不影响正常使用，应用仍然可用
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW registration failed — app still works without it
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />)
