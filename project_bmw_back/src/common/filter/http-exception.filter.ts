import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { getHttpFailMessage } from '@common/response-message';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: any = exception.getStatus();

    const target: string = exception.message;
    const messages: object | undefined = getHttpFailMessage(status);
    const message: string = messages ? messages[target] : '요청에 실패했습니다.';

    // ValidationPipe에서 만든 유효성 검사 결과를 errors에 담는다.
    // TODO: 개선 및 한글 메세지로 변경 필요함
    let errors: object | undefined;
    if (target === 'Bad Request Exception' && typeof exception.getResponse() === 'object') {
      const errResponse: any = exception.getResponse();
      errors = errResponse.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
