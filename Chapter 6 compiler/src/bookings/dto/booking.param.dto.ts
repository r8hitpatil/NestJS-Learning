import { IsUUID } from "class-validator";

export class BookingParamDto{
    @IsUUID()
    id! : string;
}