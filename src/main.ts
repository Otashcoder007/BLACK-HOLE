import 'dotenv/config';
import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder().setTitle('LMS API').setDescription('Learning Management System API').setVersion('1.0.0').addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}, 'access-token').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    const port = Number(process.env.DB_PORT ?? 3000);
    await app.listen(port);


    console.log(`Server is listening on: ${process.env.DB_PORT}`);
    console.log(`You can check here: http://localhost:${process.env.DB_PORT}/swagger`);
}

bootstrap();
