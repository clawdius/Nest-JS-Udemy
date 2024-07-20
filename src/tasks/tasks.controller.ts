import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {} from './tasks-status.enum';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/tasks')
@UseGuards(AuthGuard('jwt')) // Use guards to protect the entire controller from unauthorized access
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTask(@Query() findTaskDto: FindTaskDto): Promise<Task[]> {
    return this.taskService.getTask(findTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    return this.taskService.updateTaskStatus(id, status);
  }
}
