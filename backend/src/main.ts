import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Punto de arranque de la aplicación NestJS.
 * Aquí se inicializa el servidor, se configuran middlewares globales y se lanza la app.
 */
async function bootstrap() {
    // Crea la aplicación a partir del AppModule (raíz del backend)
    const app = await NestFactory.create(AppModule);

    /**
     * Configuración de CORS
     * Permite que el frontend (Next.js en localhost:3000 o el valor del .env WEB_ORIGIN)
     * pueda comunicarse con el backend.
     * credentials: true → habilita envío de cookies o cabeceras auth.
     */
    app.enableCors({
    origin: [process.env.WEB_ORIGIN],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    });

    /**
     * Pipes globales de validación
     * - whitelist: elimina propiedades no definidas en los DTOs.
     * - forbidNonWhitelisted: lanza error si llegan campos extra.
     * - transform: castea automáticamente los tipos de los DTOs.
     */
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true, // convierte strings numéricos en number
        },
    }));

    // Levanta el servidor (por defecto en puerto 3000 o el definido en .env)
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();