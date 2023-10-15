import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';
import { NOTIFICATIONS_SERVICE_NAME } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: NOTIFICATIONS_SERVICE_NAME,
      protoPath: join(__dirname, '../../../proto/notification.proto'),
      url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL'),
    },
  });
  app.useLogger(app.get(Logger));
  app.startAllMicroservices();
}
bootstrap();
