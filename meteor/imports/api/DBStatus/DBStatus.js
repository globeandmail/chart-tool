import { Mongo } from 'meteor/mongo';

const DBStatus = new Mongo.Collection('database-status');

export default DBStatus;
