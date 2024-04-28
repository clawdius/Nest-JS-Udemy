import { Injectable, NotFoundException } from '@nestjs/common';
// import { TaskStatus } from './tasks-status.enum';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { FindTaskDto } from './dto/find-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private TasksRepository: Repository<Task>,
  ) {}

  // getAllTask(): Task[] {
  //   return this.tasksList;
  // }

  // findTask(findTaskDto: FindTaskDto): Task[] {
  //   const { status, search } = findTaskDto;

  //   let tasks = this.getAllTask();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.name.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }

  //       return false;
  //     });
  //   }

  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const data = await this.TasksRepository.findOne({ where: { id } });

    if (!data) {
      throw new NotFoundException('Task not found!');
    }

    return data;
  }

  async deleteTaskById(id: string): Promise<void> {
    const data = await this.TasksRepository.findOneBy({ id });

    if (!data) {
      throw new NotFoundException('Task not found!');
    }

    await this.TasksRepository.delete({ id });
  }

  // deleteTaskById(id: string): void {
  //   const found = this.getTaskById(id);

  //   if (found) {
  //     this.tasksList = this.tasksList.filter((task) => task.id !== id);
  //   } else {
  //     throw new NotFoundException();
  //   }
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { name, description } = createTaskDto;

    const task = this.TasksRepository.create({
      name,
      description,
      status: TaskStatus.OPEN,
    });

    await this.TasksRepository.insert(task);
    return task;
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
