import { Injectable } from "@nestjs/common";

@Injectable()
export class MockBookingService{
    async getBookings(id:string) {return  {id , mock : true}; }
}