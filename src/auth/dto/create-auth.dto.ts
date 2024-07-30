import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  photoProfile: string;
}
