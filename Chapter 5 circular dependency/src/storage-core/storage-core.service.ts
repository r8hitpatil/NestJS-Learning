import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageCoreService {
    getBookingReceipt(){
        return "Booking receipt business logic"
    }
}
