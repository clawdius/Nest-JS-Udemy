import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class FindTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
