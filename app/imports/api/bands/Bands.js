import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const bandsName = 'Bands';

/** Define a Mongo collection to hold the data. */
const Bands = new Mongo.Collection(bandsName);

/**
 * Define a schema to specify the structure of each document in the collection.
 * Names must be unique.
 */
const BandSchema = new SimpleSchema({
  name: { type: String, index: true, unique: true },
  owner: { type: String, optional: false },

  interests: { type: Array, optional: false },
  'interests.$': { type: String },

  positions: { type: Array, optional: false },
  'positions.$': { type: Object },
  'positions.$.name': { type: String, optional: false },
  'positions.$.instrument': { type: String, optional: false },
  'positions.$.profileId': { type: String, optional: true },

  applicants: { type: Array },
  'applicants.$': { type: Object },
  'applicants.$.profileId': { type: String },
  'applicants.$.position': { type: String },

}, { tracker: Tracker });

/** Attach this schema to the collection. */
Bands.attachSchema(BandSchema);

/** Make the collection and schema available to other code. */
export { Bands, BandSchema, bandsName };
