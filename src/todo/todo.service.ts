import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [{ id: 1, description: 'test', done: false }];

  create(createTodoDto: CreateTodoDto): Todo {
    const todo = new Todo();
    todo.id = Math.max(...this.todos.map((_todo) => _todo.id), 0) + 1;
    todo.description = createTodoDto.description;

    this.todos.push(todo);

    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((_todo) => _todo.id === id);

    if (!todo) {
      throw new NotFoundException(`Todo with #${id} not found`);
    }

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const { description, done } = updateTodoDto;
    const todo = this.findOne(id);

    if (description) {
      todo.description = description;
    }

    if (done !== undefined) {
      todo.done = done;
    }

    this.todos = this.todos.map((_todo) => (_todo.id === id ? todo : _todo));

    return todo;
  }

  remove(id: number) {
    const todo = this.findOne(id);

    this.todos = this.todos.filter((_todo) => _todo.id !== id);
  }
}
