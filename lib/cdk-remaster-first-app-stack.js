"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkRemasterFirstAppStack = void 0;
const cdk = require("aws-cdk-lib");
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const apigw = require("aws-cdk-lib/aws-apigateway");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class CdkRemasterFirstAppStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.CdkRemasterFirstAppStack = CdkRemasterFirstAppStack;