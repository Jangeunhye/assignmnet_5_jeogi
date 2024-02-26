import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Accommodation,
  Partner,
  Prisma,
  Reservation,
  Review,
  Room,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { parseCheckedInAtToDate } from 'src/utils/parseCheckedInAtToDate';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(
    accommodationId: Accommodation['id'],
    dataWithoutAccommodationId: Prisma.RoomCreateWithoutAccommodationInput,
  ) {
    const data: Prisma.RoomUncheckedCreateInput = {
      accommodationId,
      ...dataWithoutAccommodationId,
    };
    return await this.prismaService.room.create({ data });
  }

  async deleteRoom(roomId: Room['id']) {
    return await this.prismaService.room.delete({ where: { id: roomId } });
  }

  async makeReservation(
    reservedById: Reservation['reservedById'],
    roomId: Reservation['roomId'],
    date: Reservation['date'],
  ) {
    const reservation = await this.prismaService.reservation.update({
      where: { roomId_date: { roomId, date } },
      data: { reservedAt: new Date(), reservedById },
    });

    return reservation;
  }

  async checkedInRoom(
    partner: Pick<Partner, 'id'>,
    reservationId: Reservation['id'],
    accommodationId: Accommodation['id'],
    checkedInAt: string,
  ) {
    // partner가 해당 accommodation에 접근할 수 있는지 확인하기
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId, partnerId: partner.id },
    });
    if (!accommodation) throw new ForbiddenException();

    const reservation = await this.prismaService.reservation.update({
      where: { id: reservationId },
      data: { checkedInAt: parseCheckedInAtToDate(checkedInAt) },
    });

    return reservation;
  }

  async cancelReservation(
    partner: Pick<Partner, 'id'>,
    user: Pick<User, 'id'>,
    reservationId: Reservation['id'],
    accommodationId: Accommodation['id'],
  ) {
    if (partner) {
      // partner가 해당 accommodation에 접근할 수 있는지 확인하기
      const accommodation = await this.prismaService.accommodation.findUnique({
        where: { id: accommodationId, partnerId: partner.id },
      });
      if (!accommodation) throw new ForbiddenException();
    }
    if (user) {
      const reservation = await this.prismaService.reservation.findUnique({
        where: { reservedById: user.id, id: reservationId },
      });
      if (!reservation) throw new ForbiddenException();
    }
    const reservation = await this.prismaService.reservation.update({
      where: { id: reservationId },
      data: {
        reservedBy: undefined,
        reservedById: null,
        reservedAt: null,
        checkedInAt: null,
      },
    });
    return reservation;
  }

  async writeReview(
    user: Pick<User, 'id'>,
    reservationId: Reservation['id'],
    rating: Review['rating'],
    content?: Review['content'],
  ) {
    console.log(reservationId);
    const reservation = await this.prismaService.reservation.findUnique({
      where: {
        reservedById: user.id,
        id: reservationId,
        checkedInAt: { not: null },
      },
    });

    if (!reservation) throw new ForbiddenException();

    const data: Prisma.ReviewUncheckedCreateInput = {
      userId: user.id,
      roomId: reservation.roomId,
      rating,
      content,
    };
    const review = await this.prismaService.review.create({
      data,
    });
    return review;
  }
}
