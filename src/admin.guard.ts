import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const token = process.env.ADMIN_TOKEN;
    const req: Request = GqlExecutionContext.create(context).getContext().req;
    return !!token && req.headers.authorization === `Bearer ${token}`;
  }
}
