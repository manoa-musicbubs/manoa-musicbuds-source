import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const instrumentsName = 'Instruments';

/** Define a Mongo collection to hold the data. */
const Instruments = new Mongo.Collection(instrumentsName);

/**
 * Define a schema to specify the structure of each document in the collection.
 * Names must be unique.
 * */
const InstrumentsSchema = new SimpleSchema({
  name: { type: String, index: true, unique: true },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Instruments.attachSchema(InstrumentsSchema);

/** Make the collection and schema available to other code. */
export { Instruments, InstrumentsSchema, instrumentsName };
