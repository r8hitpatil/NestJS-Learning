import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope : Scope.REQUEST })
export class DogService {
    constructor(@Inject(REQUEST) private request: Request){}
}