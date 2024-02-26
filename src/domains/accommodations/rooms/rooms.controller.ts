import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Partner, User } from '@prisma/client';
import { DPartner } from 'src/decorators/partner.decorator';
import { Private } from 'src/decorators/private.decorator';
import { DUser } from 'src/decorators/user.decorator';
import day from 'src/utils/day';
import { RoomsService } from './rooms.service';

@Controller('/accommodations/:accommodationId/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('/:roomId/reservations')
  @Private('user')
  makeReservation(
    @DUser() user: User,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body('date') date: string,
  ) {
    return this.roomsService.makeReservation(
      user.id,
      roomId,
      day(date).startOf('day').toDate(),
    );
  }

  @Post('/:roomId/reservations/:reservationId')
  @Private('partner')
  checkedInRoom(
    @DPartner() partner: Partner,
    @Param('accommodationId', ParseIntPipe) accommodationId: number,
    @Param('reservationId') reservationId: string,
    @Body('checkedInAt') checkedInAt: string,
  ) {
    return this.roomsService.checkedInRoom(
      partner,
      reservationId,
      accommodationId,
      checkedInAt,
    );
  }

  @Post('/:roomId/reservations/:reservationId/cancel')
  @Private('partner' || 'user')
  cancelReservation(
    @DPartner() partner: Partner,
    @DUser() user: User,
    @Param('accommodationId', ParseIntPipe) accommodationId: number,
    @Param('reservationId') reservationId: string,
  ) {
    return this.roomsService.cancelReservation(
      partner,
      user,
      reservationId,
      accommodationId,
    );
  }

  @Post('/:roomId/reservations/:reservationId/review')
  @Private('user')
  writeReview(
    @DUser() user: User,
    @Param('reservationId') reservationId: string,
    @Body('rating', ParseIntPipe) rating: number,
    @Body('content') content: string,
  ) {
    return this.roomsService.writeReview(user, reservationId, rating, content);
  }
}
