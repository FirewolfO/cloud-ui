# Cloud UI

整个云服务的统一 Web 入口，使用 Vue 3、TypeScript、Vite、Vue Router、Pinia 和 Element Plus 实现。

当前包含：

- 登录和注册，支持账号、邮箱或手机号登录
- 未登录路由守卫和服务端 Session 恢复
- 留白的 Cloud Console 主页
- 右上角头像资料面板与退出登录
- 显示名称、邮箱、手机号和头像地址维护

## 启动

先启动 `sigin` 服务，然后执行：

```bash
npm install
npm run dev
```

前端默认监听 `http://localhost:5176`，并将 `/api` 代理到 `http://127.0.0.1:8084`。可通过 `.env.local` 中的 `VITE_SIGNIN_PROXY_TARGET` 覆盖后端地址。

## 验证

```bash
npm run typecheck
npm test
npm run build
```
