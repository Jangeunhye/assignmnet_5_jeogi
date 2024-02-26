import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

@Module({
  providers: [PartnersService],
  controllers: [PartnersController],
})
export class PartnersModule {}
