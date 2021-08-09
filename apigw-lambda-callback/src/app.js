
/*  
SPDX-FileCopyrightText: 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0 
*/

console.log('Loading function');
const aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    console.log("Executing...");
    try {
        console.log("Event: ", JSON.stringify(event, null, 2));
        console.log("Context: ", JSON.stringify(context, null, 2));
        
        const body = event.body
        const messageBody = body.body;

        const stsparams = {
            RoleArn: "arn:aws:iam::077927938888:role/sam-app-CallbackRole-1K24791VOX8VO",
            RoleSessionName: "CallbackRole"
        };
        var sts = new aws.STS();
        const assumeRole = await sts.assumeRole(stsparams).promise();
        const roleCreds = {
            accessKeyId: assumeRole.Credentials.AccessKeyId,
            secretAccessKey: assumeRole.Credentials.SecretAccessKey,
            sessionToken: assumeRole.Credentials.SessionToken
        };

        

        console.log(roleCreds);

        const sfnparams = {
            output: "\"Callback task completed successfully.\"",
            taskToken: body.TaskToken
        };

        console.log(`Calling Step Functions to complete callback task with params ${JSON.stringify(sfnparams)}`);

        const stepfunctions = new aws.StepFunctions(roleCreds);

        await stepfunctions.sendTaskSuccess(sfnparams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(messageBody, null, 2),
        };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

