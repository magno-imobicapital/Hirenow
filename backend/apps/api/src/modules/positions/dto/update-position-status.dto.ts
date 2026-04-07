import { IsBoolean } from 'class-validator';

export class UpdatePositionStatusDto {
  @IsBoolean()
  isActive: boolean;
}
