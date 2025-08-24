import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, headers, body, query, params } = request;
    const userAgent = headers['user-agent'] || '';
    const clientIP = headers['x-forwarded-for'] || request.connection.remoteAddress;

    const startTime = Date.now();

    // Log da requisição
    this.logger.log(`
[REQUEST] ${method} ${url}
IP: ${clientIP}
User-Agent: ${userAgent.substring(0, 100)}${userAgent.length > 100 ? '...' : ''}
${query && Object.keys(query).length ? `Query: ${JSON.stringify(query)}` : ''}
${params && Object.keys(params).length ? `Params: ${JSON.stringify(params)}` : ''}
${body && Object.keys(body).length && !this.isSensitiveRoute(url) ? `Body: ${JSON.stringify(body, null, 2)}` : ''}
${this.isSensitiveRoute(url) ? 'Body: [SENSITIVE DATA HIDDEN]' : ''}
Started at: ${new Date().toISOString()}
    `);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(`
[SUCCESS] ${method} ${url} - ${statusCode}
Duration: ${duration}ms
Response size: ${JSON.stringify(data).length} bytes
Completed at: ${new Date().toISOString()}
          `);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(`
[ERROR] ${method} ${url} - ${statusCode}
Duration: ${duration}ms
Error: ${error.message}
Stack: ${error.stack?.split('\n')[0] || 'N/A'}
Failed at: ${new Date().toISOString()}
          `);
        },
      }),
    );
  }

  private isSensitiveRoute(url: string): boolean {
    const sensitiveRoutes = [
      '/auth/login',
      '/auth/reset-password',
      '/auth/change-temporary-password',
      '/users'
    ];

    return sensitiveRoutes.some(route => url.includes(route));
  }
}