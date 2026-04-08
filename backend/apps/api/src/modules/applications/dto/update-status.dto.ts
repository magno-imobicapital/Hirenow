import { IsIn } from 'class-validator';

const RECRUITER_STATUSES = [
  'PENDING',
  'REVIEWING',
  'INTERVIEW',
  'TECHNICAL_INTERVIEW',
  'HIRED',
  'REJECTED',
] as const;

export class UpdateStatusDto {
  @IsIn(RECRUITER_STATUSES, { message: 'Status inválido' })
  status: (typeof RECRUITER_STATUSES)[number];
}
