import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    // TODO Custom logger, json output when prod and webhook alert
    // const app = await NestFactory.create(AppModule, {
    //     logger: new ConsoleLogger({
    //         json: true
    //     })
    // });
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
