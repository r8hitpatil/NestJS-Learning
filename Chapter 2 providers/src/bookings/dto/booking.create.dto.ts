import { IsNumber, IsString } from "class-validator";

export class CreateBookingDto{
    @IsString()
    location! : string;
    
    @IsNumber()
    price! : number;
}