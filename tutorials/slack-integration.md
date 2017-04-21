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

### **Step 5:** Enable Slack notifications under `chart-tool-config.json`.

This is what `chart-tool-config.json` will look like by default:

```javascript
"slack": {
  "enable": false,
  "username": "Chart tool",
  "edit_address": "https://chart-tool-demo.herokuapp.com/chart/edit/",
}
```

You'll need to tweak those options based on your Slack app.

* `enable`: Whether or not Slack notifications should be used. Change this to `true`
* `username`: Choose the username of the bot that posts the message. It should be the same name as the Slack app you created.
* `edit_address`: This is the base of the edit address so you need to customize it to your domain.
