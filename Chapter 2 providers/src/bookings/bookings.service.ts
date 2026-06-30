import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/booking.create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingParamDto, UpdateBookingsDto } from './dto';
@Injectable()
export class BookingsService {
    constructor(private readonly prisma : PrismaService){}

    async getBookings(input:BookingParamDto){
        return this.prisma.bookings.findUnique({
            where : {
                id : input.id
            }
        })
    }

    async createBooking(input:CreateBookingDto) {
        return this.prisma.bookings.create({
            data : input
        })
    }

    async updateBooking(id:BookingParamDto,input:UpdateBookingsDto){
        return this.prisma.bookings.update({
            where : id,
            data : {...input}
        })
    }

    async deleteBooking(id:BookingParamDto){
        return this.prisma.bookings.delete({
            where : id
        })
    }
}