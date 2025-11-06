import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    var exist: boolean;
    if (!request.currentUser) {
      exist = false;
    } else {
      exist = request.currentUser.admin;
    }

    return exist;
  }
}
