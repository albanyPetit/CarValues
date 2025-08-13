import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto'; //el primero para generar la salt y el segundo es la funcion hash
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email is in use
    const resul = await this.usersService.find(email);
    if (resul.length) {
      throw new BadRequestException('email in use');
    }

    //hash the users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; //ultimo parametro e sla longitud

    //Join the hashed result and the salt together -> this is what we put in our DB
    const result = salt + '.' + hash.toString('hex');

    //create a new user and save it
    const user = await this.usersService.create(email, result);

    //rerurn the user if everything is ok
    return user;
  }

  async signin(email: string, password: string) {
    //see if email is in use
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
