# About the Chart Tool interface

Though the Chart Tool interface is **mostly** about the chart editing screen, there are a bunch of other pages and features you might not be aware of. 


----------


### Routes

The interface has several routes available:

* `/new`: Make a new chart (also the default route)
* `/archive`: List and search through all generated charts
* `/chart/:_id`: Preview an individual chart, a handy link for sharing with colleagues
* `/chart/:_id/edit`: Edit or export a chart based on its Mongo ID
* `/chart/:_id/pdf`: Preview what an exported PDF will look like (warning: the chart will be teeny tiny since all the fonts are print-sized)
* `/status`: A basic status page listing number of charts in the database, active users, and server and database connection status


### API endpoints

There are also a couple of JSON API endpoints available:

* `/api/get/_id`: Get the full database entry for a chart based on its MongoDB ID
* `/api/status`: Tries to write to the database and returns either true or false depending on whether the write is successful or not. Useful for setting up an alert in case your database goes down


### Collaborative editing

Chart Tool supports real-time collaborative editing. If another user has your chart open, you'll both be assigned random animal names and see a box warning you someone else has your chart open.

![Collaborative editing](http://i.imgur.com/IEkGTOE.jpg)
