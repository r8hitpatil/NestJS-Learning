import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingParamDto, CreateBookingDto, UpdateBookingsDto } from './dto';

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService,
        @Inject('APP_PORT') private readonly appPort: string,
        @Inject('PORT') private readonly port:string,
        @Inject('BOOKING_STATS') private readonly stats : { total : number, note : string },
        @Inject('BOOKING_ALIAS') private readonly aliasService:BookingsService
    ){}

    @Get('alias/check')
    checkAlias(){
        return { sameInstance : this.bookingsService === this.aliasService };
    }

    @Get('stats/all')
    getStats() {
        return this.stats;
    }

    @Get(':id')
    async getBookings(@Param() id: BookingParamDto){
        console.log(this.port);
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