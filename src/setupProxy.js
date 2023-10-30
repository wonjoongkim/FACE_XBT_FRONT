// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/register', // 프록시를 설정할 경로
        createProxyMiddleware({
            target: 'http://localhost:3001', // 프록시 대상 URL
            changeOrigin: true // 도메인이 다른 경우 필요한 옵션
        })
    );
};
