import { IsBoolean, IsEnum, IsNumber, IsString, Min } from 'class-validator';

enum EmploymentType {
  CLT = 'CLT',
  PJ = 'PJ',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
  TEMPORARY = 'TEMPORARY',
}

enum Currency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export class CreatePositionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(EmploymentType, { message: 'Tipo de contratação inválido' })
  employmentType: EmploymentType;

  @IsString()
  location: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salaryMin: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salaryMax: number;

  @IsEnum(Currency, { message: 'Moeda inválida' })
  currency: Currency;

  @IsBoolean()
  isActive: boolean;
}
