import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { getInfoReq } from '@/global/helper';

@Catch()
export default class UnifyExceptionFilter implements ExceptionFilter {
  // 注入日志服务相关依赖
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取当前执行上下文
    const res = ctx.getResponse<Response>(); // 获取响应对象
    const req = ctx.getRequest<Request>(); // 获取请求对象
    const status = exception.getStatus();

    const response = exception.getResponse();
    let msg =
      exception.message || (status >= 500 ? 'Service Error' : 'Client Error');

    if (
      Object.prototype.toString.call(response) === '[object Object]' &&
      (response as any).message
    ) {
      msg = (response as any).message;
    }

    // 记录日志（错误消息，错误码，请求信息等）
    this.logger.error(msg, {
      status,
      req: getInfoReq(req),
      // stack: exception.stack,
    });

    res.status(status >= 500 ? status : 200).json({ code: status, msg });
  }
}
