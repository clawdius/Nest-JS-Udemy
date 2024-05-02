import { Injectable, NotFoundException } from '@nestjs/common';
// import { TaskStatus } from './tasks-status.enum';
// import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
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

  async getTask(FindTaskDto: FindTaskDto): Promise<Task[]> {
    const { status, search } = FindTaskDto;
    const query = this.TasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status }); // Remember "?" from sql which detects variable? yeah that's it.
    }

    if (search) {
      query.andWhere(
        'LOWER(task.name) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const data = await this.TasksRepository.findOne({ where: { id } });

    if (!data) {
      throw new NotFoundException('Task not found!');
    }

    return data;
  }

  async deleteTaskById(id: string): Promise<void> {
    const data = await this.TasksRepository.delete({ id });

    if (data.affected === 0) {
      throw new NotFoundException('Data not found!');
    }
  }

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

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.TasksRepository.save(task);

    return task;
  }
}
