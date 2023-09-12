import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import 'reflect-metadata';

export interface Todo extends Base {}

export class Todo extends TimeStamps {
  @prop({ required: true })
  public title: string;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public done: boolean;

  @prop({ required: true })
  public userId: string;
}

export const TodoModel = getModelForClass(Todo);
