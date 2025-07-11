import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    //usamos el decoretor, llamamos al arg body y definimos su tipo como DTO
    //console.log(body);
    this.usersService.create(body.email, body.password);
  }
}
