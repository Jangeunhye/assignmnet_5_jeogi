import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestFactor라는 클래스의 정적 메서드인 create를 토애서 application instance를 생성할 수 있다.

  //   const app = await NestFactory.create(AppModule);
  //
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(5050);
}
bootstrap();
