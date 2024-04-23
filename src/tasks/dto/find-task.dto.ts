import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.model';

export class FindTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
