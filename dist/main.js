"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_ws_1 = require("@nestjs/platform-ws");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const origins = (config.get('CORS_ORIGINS') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    app.enableCors({
        origin: origins.length ? origins : ['http://localhost:5173'],
        credentials: true,
    });
    const port = parseInt(config.get('PORT', '8000'), 10);
    await app.listen(port);
    console.log(`Courrier API (Nest) http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map