import React from 'react';
import { Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { Bands, bandsName } from '../../api/bands/Bands';
import ManageBand from '../components/ManageBand';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (band) => {
  const schema = _.object(band.positions.map(pos => {

    const profiles = band.applicants
      .filter(app => app.position === pos.name)
      .map(x => x.profileId)
      .map(id => Profiles.findOne({ _id: id }));

    const allowedValues = _.pluck(profiles, 'email');

    return [pos.name, { type: String, allowedValues, optional: true }];
  }));

  return new SimpleSchema(schema);
};

const updateBandPositions = (band, data) => {
  const positions = band.positions.map(pos => {
    const email = data[pos.name];
    return email ?
      { ...pos, profileId: Profiles.findOne({ email })._id } :
      _.omit(pos, 'profileId');
  });

  Bands.update(
    { _id: band._id },
    { $set: { positions } },
    error => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Successfully updated band', 'success');
      }
    },
  );
};

class ManageBands extends React.Component {
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const bands = Bands.find({ owner: Meteor.userId() }).fetch();

    return (
      <div>
        { bands.map(band => {
            const formSchema = makeSchema(band);

            const model = _.object(band.positions.map(pos => {
              const email = pos.profileId ?
                Profiles.findOne({ _id: pos.profileId }).email :
                null;

              return [pos.name, email];
            }));

            return <ManageBand
              key={band._id}
              schema={formSchema}
              band={band}
              model={model}
              onSubmit={data => updateBandPositions(band, data)} />;
          })
        }
      </div>
    );
  }
}

ManageBands.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => ({
  // Ensure that minimongo is populated with all collections prior to running render().
  ready: [
    profilesName,
    bandsName,
  ].map(Meteor.subscribe).every(x => x.ready()),
}))(ManageBands);
