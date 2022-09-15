import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// Implement the dataLayer logic

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      ExpressionAttributeValues: {
        ':userId': userId
      },
      KeyConditionExpression: 'userId = :userId',
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Creating a todo');
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem;
  }

  async updateTodo(todoItemId: string, todoItemUpdate: TodoUpdate): Promise<TodoUpdate> {
    logger.info('Updating a todo');
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        ID: todoItemId,
      },
      UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
        ':name': todoItemUpdate.name,
        ':dueDate': todoItemUpdate.dueDate,
        ':done': todoItemUpdate.done,
      }
    }).promise()

    return todoItemUpdate;
  }


  async deleteTodo(todoItemId: string): Promise<boolean> {
    logger.info('Deleting a todo');
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        ID: todoItemId,
      },
    }).promise()

    return true;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}