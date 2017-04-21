# Adding Slack to Chart Tool

By adding your Slack team to Chart Tool, you can post messages when new charts are created.


----------

### Before you do anything
Create a private Testing channel so you don't overwhelm a channel and be *that person*.

### **Step 1:** Create your Slack app
Go  to [Slack's apps](https://api.slack.com/apps) and go through the process of creating a new app. You'll be asked for an App Name as well as the Development Slack Team, which is the team to post the messages.

### **Step 2:** Activate the Incoming Webhooks feature
In the features section of your newly created app, click on the Incoming Webhooks section, and then toggle on this feature.

### **Step 3:** Add New Webhook to Team
Click on the Add New Webhook to Team and choose the name of your testing channel.

### **Step 4:** Save Webhook URL as environment variable.
Grab the Webhook Url and save it as SLACK_WEBHOOK in your environment variable.
