import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import path = require("path");
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkRemasterFirstAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Dyanamodb definir la tabla
    const greetingsTable = new dynamodb.Table(this, "GreetingsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    const saveHelloFunction = new lambda.Function(this, "SaveHelloFunction", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler.saveHello",
      code: lambda.Code.fromAsset(path.resolve(__dirname, "lambda")),
      environment: {
        GREENTINGS_TABLE: greetingsTable.tableName,
      },
    });

    greetingsTable.grantReadWriteData(saveHelloFunction);

    const helloAPI = new apigw.RestApi(this, "helloApi");
    
    helloAPI.root
    .resourceForPath("hello")
    .addMethod("POST", new apigw.LambdaIntegration(saveHelloFunction));
    

  }
}
