Purpose of this project: provide an easy way to create a Slack Slash Command that references a set of images and randomly sends one back to your command, and give you an easy way to add more images to the possible ones to pull from.

After cloning the repository and doing an NPM Install: 

Create an IAM Access Key: `https://console.aws.amazon.com/iam/home?#/users/serverless-agent`, click `Security credentials`, `Create access key`

Configure Serverless: `serverless config credentials --provider aws --key xxxxxxxxxxxxxx --secret xxxxxxxxxxxxxx`

Once you're connected to AWS and ready to deploy for a new Slash Command, go into serverless.yaml, change the service name and stage, and when you do your next `serverless deploy` it will create new functions and dynamo table. Also update the fallbackText and commandColor in serverless.yaml to match what you want your command to return

To-Do:
- Enable file uploading to S3 via a Lambda function so that you're not just referencing external images but can upload new ones
- Allow the deletion of images from the dynamboDB table (and S3 once that's created)