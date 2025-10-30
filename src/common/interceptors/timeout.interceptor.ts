// src/common/interceptors/timeout.interceptor.ts
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler, 
  RequestTimeoutException 
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 30000) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err: any) => {
        if (err instanceof TimeoutError) {
          return throwError(() => 
            new RequestTimeoutException('La solicitud ha excedido el tiempo de espera')
          );
        }
        return throwError(() => err);
      })
    );
  }
}