import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditCoreService {
    getBookingStatus(){
        return "Booking status business logic";
    }
}
