# Cloud UI

整个云服务的统一 Web 入口，使用 Vue 3、TypeScript、Vite、Vue Router、Pinia 和 Element Plus 实现。

当前包含：

- 登录和注册，支持账号、邮箱或手机号登录
- 未登录路由守卫和服务端 Session 恢复
- 留白的 Cloud Console 主页
- 右上角头像资料面板、账号管理入口与退出登录
- 账号管理中的基本资料和登录密码维护
- 用户 API AK/SK 创建、查看、复制和删除

## 启动

先启动 `sigin` 和 Gateway 服务，然后执行：

```bash
npm install
npm run dev
```

前端默认监听 `http://localhost:5176`。CSRF、登录、注册和验证码请求通过 `/api/v1` 代理到 `sigin` 的 `http://127.0.0.1:8084`；登录后的账号请求通过 `/api/open/signin` 代理到 Gateway 的 `http://127.0.0.1:8082`。可分别使用 `VITE_SIGNIN_PROXY_TARGET`、`VITE_GATEWAY_PROXY_TARGET` 覆盖目标地址。

## 验证

```bash
npm run typecheck
npm test
npm run build
```
