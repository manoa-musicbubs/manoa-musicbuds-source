import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo Contacts to hold the data. */
const Contacts = new Mongo.Collection('Contacts');

/** Define a schema to specify the structure of each document in the Contacts. */
const ContactsSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  address: String,
  image: String,
  description: String,
  owner: String,
}, { tracker: Tracker });

/** Attach this schema to the Contacts. */
Contacts.attachSchema(ContactsSchema);

/** Make the Contacts and schema available to other code. */
export { Contacts, ContactsSchema };
