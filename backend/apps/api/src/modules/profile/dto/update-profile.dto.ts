import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthDate?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  landlinePhone?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salaryExpectation?: number;
}
