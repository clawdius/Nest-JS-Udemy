import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as UUID } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

@Injectable()
export class TasksService {
  private tasksList: Task[] = [];

  getAllTask(): Task[] {
    return this.tasksList;
  }

  findTask(findTaskDto: FindTaskDto): Task[] {
    const { status, search } = findTaskDto;

    let tasks = this.getAllTask();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.name.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasksList.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} cannot be found`);
    }

    return task;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);

    if (found) {
      this.tasksList = this.tasksList.filter((task) => task.id !== id);
    } else {
      throw new NotFoundException();
    }
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { name, description } = createTaskDto;

    const task: Task = {
      id: UUID(),
      name,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasksList.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
