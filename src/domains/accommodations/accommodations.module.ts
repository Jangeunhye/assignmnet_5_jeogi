import { Module } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { RegionsModule } from './regions/regions.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
  imports: [RegionsModule, RoomsModule],
})
export class AccommodationsModule {}
