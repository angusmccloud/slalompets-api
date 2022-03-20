Purpose of this project: Backend for the Slalom Boston 2022 Retreat

After cloning the repository and doing an NPM Install: 

Create an IAM Access Key: `https://console.aws.amazon.com/iam/home?#/users/serverless-agent`, click `Security credentials`, `Create access key`

Configure Serverless: `serverless config credentials --provider aws --key xxxxxxxxxxxxxx --secret xxxxxxxxxxxxxx`

Once you're connected to AWS and ready to deploy for a new Slash Command, go into serverless.yaml, change the service name and stage, and when you do your next `serverless deploy` it will create new functions and dynamo table. Also update the fallbackText and commandColor in serverless.yaml to match what you want your command to return