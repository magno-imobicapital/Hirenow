import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EmploymentType, { message: 'Tipo de contratação inválido' })
  employmentType?: EmploymentType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsEnum(Currency, { message: 'Moeda inválida' })
  currency?: Currency;
}
