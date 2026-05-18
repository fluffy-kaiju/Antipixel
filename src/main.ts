import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaFilter } from '@db/db/prisma/prisma.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';

const log = new Logger(bootstrap.name);

function setupSwaggerModule(app: INestApplication<any>) {
    const config = new DocumentBuilder()
        .setTitle('Antipixel api')
        .setDescription('The antipixel API description')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}

function setupDTOModule(app: INestApplication<any>, env: string) {
    const opt: ValidatorOptions = {};

    if (env === 'development') {
        opt.enableDebugMessages = true;
    }

    opt.whitelist = true;
    opt.forbidNonWhitelisted = true;

    app.useGlobalPipes(new ValidationPipe(opt));

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll'
    }));
}

function setupFiltersModule(app: INestApplication<any>) {
    app.useGlobalFilters(new PrismaFilter());
}


async function bootstrap() {
    // TODO Custom logger, json output when prod and webhook alert
    // const app = await NestFactory.create(AppModule, {
    //     logger: new ConsoleLogger({
    //         json: true
    //     })
    // });
    const app = await NestFactory.create(AppModule);

    const configService = app.get<ConfigService>(ConfigService);
    const env = configService.getOrThrow<string>('NODE_ENV');

    log.debug(`NODE_ENV: ${env}`);

    setupDTOModule(app, env);
    setupFiltersModule(app);
    setupSwaggerModule(app);


    app.enableShutdownHooks();

    const port = configService.getOrThrow<number>(`API_PORT`)
    await app.listen(port);
    log.verbose(`API listen to ${port}`)
}
bootstrap();
