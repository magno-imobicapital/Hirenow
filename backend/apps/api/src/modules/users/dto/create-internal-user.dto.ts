import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class CreateInternalUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;

  @IsIn(['ADMIN', 'RECRUITER'], { message: 'Role deve ser ADMIN ou RECRUITER' })
  role: 'ADMIN' | 'RECRUITER';
}
