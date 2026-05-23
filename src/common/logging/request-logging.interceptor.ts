import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { logInfo } from 'src/utils/logger/logger.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const started = Date.now();
    return next.handle().pipe(
      tap(() => {
        logInfo(`${method} ${url} ${Date.now() - started}ms`);
      }),
    );
  }
}
