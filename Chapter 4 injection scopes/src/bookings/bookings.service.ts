import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/booking.create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingParamDto, UpdateBookingsDto } from './dto';
@Injectable()
export class BookingsService {
    constructor(private readonly prisma : PrismaService,
        // @Inject('APP_CONFIG') private readonly config: { appName : string, version : number }
    ){}

    async getBookings(input:BookingParamDto){
        const slot = await this.prisma.bookings.findUnique({
            where : {
                id : input.id
            }
        })
        if(!slot){
            throw new Error("Booking slot not found");
        }
        return slot;
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