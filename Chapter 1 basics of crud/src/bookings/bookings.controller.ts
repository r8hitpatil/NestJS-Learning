import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingParamDto, CreateBookingDto, UpdateBookingsDto } from './dto';

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService){}

    @Get(':id')
    async getBookings(@Param() id: BookingParamDto){
        return this.bookingsService.getBookings(id);
    }

    @Post('create')
    async createBooking(@Body() input:CreateBookingDto){
        return this.bookingsService.createBooking(input);
    }

    @Post('update/:id')
    async updateBooking(@Param() id : BookingParamDto , @Body() input:UpdateBookingsDto){
        return this.bookingsService.updateBooking(id,input);
    }

    @Delete('delete/:id')
    async deleteBooking(@Param() id: BookingParamDto){
        return this.bookingsService.deleteBooking(id);
    }
}