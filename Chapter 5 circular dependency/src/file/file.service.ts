import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
    getFile(){
        return "Got the file";
    }
}
