const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  // TODO: Use these variables to record metric values
  let endTime
  let requestWasSuccessful

  const startTime = timeInMs();
  try {
    await axios.get(url);
    endTime = timeInMs() - startTime;
    requestWasSuccessful = true;
  } catch (error) {
    requestWasSuccessful = false;
  }

  // Example of how to write a single data point
  // await cloudwatch.putMetricData({
  //   MetricData: [
  //     {
  //       MetricName: 'MetricName', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
  //       Dimensions: [
  //         {
  //           Name: 'ServiceName',
  //           Value: serviceName
  //         }
  //       ],
  //       Unit: '', // 'Count' or 'Milliseconds'
  //       Value: 0 // Total value
  //     }
  //   ],
  //   Namespace: 'Udacity/Serveless'
  // }).promise()

  await cloudwatch.putMetricData({
    MetricData: [

      // TODO: Record time it took to get a response
      {
        MetricName: 'Latency',
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Milliseconds',
        Value: endTime
      },

      // TODO: Record if a response was successful or not
      {
        MetricName: 'Success',
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Success',
        Value: requestWasSuccessful
      }
    ],
    Namespace: 'Udacity/Serverless'
  })
}

function timeInMs() {
  return new Date().getTime()
}
