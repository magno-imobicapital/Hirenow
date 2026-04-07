import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL da reunião inválida' })
  meetingUrl?: string;

  @IsDateString({}, { message: 'Data de agendamento inválida' })
  scheduledAt: string;
}
