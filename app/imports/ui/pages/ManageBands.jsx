import React from 'react';
import { Grid, Segment, Header, Form, Loader } from 'semantic-ui-react';
import { ListField, AutoForm, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import SelectField from '../forms/controllers/SelectField';
import { Interests, interestsName } from '../../api/interests/Interests';
import { Instruments, instrumentsName } from '../../api/instruments/instruments';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { Projects, projectsName } from '../../api/projects/Projects';
import { Bands, bandsName } from '../../api/bands/Bands';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (band) => {
  const schema = {};

  for (let pos of band.positions) {
    const applicantIds = band.applicants
      .filter(app => app.position === pos.name)
      .map(x => x.profileId);

    console.log(applicantIds);

    const profiles = applicantIds.map(id => Profiles.findOne({ _id: id }));

    const allowedValues = _.pluck(
      profiles,
      'email'
    );

    schema[pos.name] = { type: String, allowedValues, optional: true };
  }

  return new SimpleSchema(schema);
};

/** Renders the Home Page: what appears after the user logs in. */
class Home extends React.Component {

  /** On submit, insert the data. */
  submit(band, data) {
    let positions = band.positions;

    positions.map(pos => {
      const email = data[pos.name];

      if (email) {
        pos.profileId = Profiles.findOne({ email })._id;

      } else {
        delete pos.profileId;
      }
    });

    console.log(positions);

    Bands.update(
      { _id: band._id },
      { $set: { positions } }
    );
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const bands = Bands.find({ owner: Meteor.userId() }).fetch();

    return (
      <div>
      {
        bands.map(band => {
          const formSchema = makeSchema(band);

          let model = {};
          for (let pos of band.positions) {
            const profile = pos.profileId ? Profiles.findOne({ _id: pos.profileId }).email : null;
            model[pos.name] = profile;
          };

          return <Grid container centered>
            <Grid.Column>
              <AutoForm model={model} schema={formSchema} onSubmit={data => this.submit(band, data)}>
                <Segment>
                  <Header as="h2" textAlign="center">{band.name}</Header>
                  { band.positions.map(pos =>
                    <SelectField name={pos.name} showInlineError={true} placeholder={pos.name} />
                  )}
                  <SubmitField value='Change'/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        })}
      </div>
    );
  }
}

Home.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(interestsName);
  const sub2 = Meteor.subscribe(profilesName);
  const sub5 = Meteor.subscribe(projectsName);
  const sub6 = Meteor.subscribe(instrumentsName);
  const sub7 = Meteor.subscribe(bandsName);
  return {
    ready: sub1.ready() && sub2.ready() && sub5.ready() && sub6.ready() && sub7.ready(),
  };
})(Home);
