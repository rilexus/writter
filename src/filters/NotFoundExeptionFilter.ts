
/*
    Catches not defined routes. Returns index.html.
*/
import {Catch, NotFoundException} from '@nestjs/common';
import {ExceptionFilter} from '@nestjs/common/interfaces/exceptions';
import {ArgumentsHost} from '@nestjs/common/interfaces/features/arguments-host.interface';
import { join } from 'path';
import { resolve } from 'path';
import * as path from 'path';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        response.sendFile(path.resolve('./public/index.html'));
    }
}