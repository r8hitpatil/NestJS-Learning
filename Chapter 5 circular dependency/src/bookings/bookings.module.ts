import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockBookingService } from './booking.mock.service';
import { AuditCoreModule } from 'src/audit-core/audit-core.module';

const isProd = process.env.NODE_ENV === 'production';

@Module({
    imports:[PrismaModule,AuditCoreModule],
    controllers:[BookingsController],
    providers:[
        {
        provide : 'APP_PORT',
        useValue : '8080'
    },
    {
        provide : 'PORT',
        useValue : process.env.PORT
    },
    {
        provide : BookingsService,
        useClass : isProd ? BookingsService : MockBookingService
    },
    {
        provide : 'BOOKING_STATS',
        useFactory : async (prisma: PrismaService) => {
            if(!isProd) return { total : 0 , note : 'mocked db' }
            const total = await prisma.bookings.count();
            return { total , note : 'computed at startup' };
        },
        inject : [PrismaService],
    },
    {
        provide : 'BOOKING_ALIAS',
        useExisting : BookingsService
    }
    ],
    exports : ['BOOKING_STATS',BookingsService],
})
export class BookingsModule {}