// src/common/interceptors/response.interceptor.ts
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data?.message || 'Operación exitosa',
          data: data?.data || data,
        };
        
        // Eliminar propiedades undefined
        Object.keys(response).forEach(
          key => response[key] === undefined && delete response[key]
        );
        
        return response;
      }),
    );
  }
}