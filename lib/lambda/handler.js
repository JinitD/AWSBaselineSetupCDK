const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.GREENTINGS_TABLE;

exports.saveHello = async (event) => {
    console.log("hello!!")
    const name = event.queryStringParameters.name;


    const item = {
        id: name,
        name: name,
        date: Date.now()
    }

    const saveItem = await this.saveItem(item);

    return {
        statusCode: 200,
        body: JSON.stringify(saveItem),
    }
}

exports.saveItem = async (item) => {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    }

    return dynamo.put(params).promise().then(() => {
        return item
    })
}