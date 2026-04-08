import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'SalaryMaxGteMin', async: false })
class SalaryMaxGteMinConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments) {
    const obj = args.object as { salaryMin?: number; salaryMax?: number };
    if (obj.salaryMin == null || obj.salaryMax == null) return true;
    return obj.salaryMax >= obj.salaryMin;
  }

  defaultMessage() {
    return 'Salário máximo deve ser maior ou igual ao salário mínimo';
  }
}

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
  @Validate(SalaryMaxGteMinConstraint)
  salaryMax: number;

  @IsEnum(Currency, { message: 'Moeda inválida' })
  currency: Currency;

  @IsBoolean()
  isActive: boolean;
}
