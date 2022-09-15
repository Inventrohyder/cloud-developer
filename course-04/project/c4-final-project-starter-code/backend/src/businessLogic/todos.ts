import { TodosAccess } from '../helpers/todosAccess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { TodoUpdate } from '../models/TodoUpdate';

// Implement businessLogic

const logger = createLogger('Todos')


const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getAllTodos(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
  logger.info('Getting all todos');
  const userId = getUserId(event);

  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
): Promise<TodoItem> {

  try {
    logger.info("Creating a new todo");
    const itemId = uuid.v4()
    const userId = getUserId(event);

    return await todosAccess.createTodo({
      todoId: itemId,
      userId: userId,
      createdAt: new Date().toISOString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: `https://${AttachmentUtils.bucketName}.s3.amazonaws.com/${itemId}`
    })
  } catch (error) {
    createError(error);
  }

}
export async function updateTodo(
  todoItemId: string,
  updateTodoRequest: UpdateTodoRequest,
): Promise<TodoUpdate> {

  try {
    logger.info("Updating a todo");

    return await todosAccess.updateTodo(todoItemId = todoItemId, {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    });
  } catch (error) {
    createError(error);
  }
}

export async function deleteTodo(todoItemId: string) {
  try {
    logger.info("Deleting a todo");

    return await todosAccess.deleteTodo(todoItemId);
  } catch (error) {
    createError(error);
  }
}

export async function createAttachmentPresignedUrl(imageId: string) {
  try {
    return await attachmentUtils.getUploadUrl(imageId);
  } catch (error) {
    createError(error);
  }
}
