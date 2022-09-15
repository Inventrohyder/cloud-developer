import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('UpdateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // Update a TODO item with the provided id using values in the "updatedTodo" object
    logger.info("Updating a todo");

    const userId = getUserId(event);

    const updatedItem = await updateTodo(todoId, updatedTodo, userId);

    return {
      statusCode: 204,
      body: JSON.stringify(updatedItem)
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
