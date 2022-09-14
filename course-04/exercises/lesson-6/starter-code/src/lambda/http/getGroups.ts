import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda'
import 'source-map-support/register'

import * as express from 'express';
import * as awsServerlessExpress from 'aws-serverless-express';

import { getAllGroups } from '../../businessLogic/groups';

const app = express();

// Add headers before the routes are defined
app.use((_req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Pass to next layer of middleware
  next();
});

app.get('/groups', async (_req, res) => {

  const groups = await getAllGroups();

  // Return a list of groups
  res.json({
    items: groups
  });

});


// Create Express Server
const server = awsServerlessExpress.createServer(app);
// Pass API Gateway events to the Express server
export const handler: APIGatewayProxyHandler = (event: APIGatewayProxyEvent, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
