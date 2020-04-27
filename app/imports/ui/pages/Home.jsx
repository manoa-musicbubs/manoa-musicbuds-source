import React from 'react';
import { Grid, Segment, Header, Form, Loader } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Interests, interestsName } from '../../api/interests/Interests';
import { Instruments, instrumentsName } from '../../api/instruments/instruments';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { Projects, projectsName } from '../../api/projects/Projects';
import { updateProfileMethod } from '../../startup/both/Methods';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests, allProjects, allInstruments) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Goals and Dreams', optional: true },
  title: { type: String, label: 'Contact Info', optional: true },
  picture: { type: String, label: 'Icon', optional: true },
  interests: { type: Array, label: 'Taste', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
  instruments: { type: Array, label: 'Instruments', optional: true },
  'instruments.$': { type: String, allowedValues: allInstruments },
  projects: { type: Array, label: 'Events', optional: true },
  'projects.$': { type: String, allowedValues: allProjects },
});

/** Renders the Home Page: what appears after the user logs in. */
class Home extends React.Component {

  /** On submit, insert the data. */
  submit(data) {
    Meteor.call(updateProfileMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const email = Meteor.user().username;
    // Create the form schema for uniforms. Need to determine all interests and projects for muliselect list.
    const allInterests = _.pluck(Interests.find().fetch(), 'name');
    const allInstruments = _.pluck(Instruments.find().fetch(), 'name');
    const allProjects = _.pluck(Projects.find().fetch(), 'name');
    const formSchema = makeSchema(allInterests, allProjects, allInstruments);
    // Now create the model with all the user information.
    const profile = Profiles.findOne({ email });
    const model = _.extend(
      {},
      profile,
      { interests: profile.interests, instruments: profile.instruments, projects: profile.projects },
    );
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center" inverted>Your Info</Header>
          <AutoForm model={model} schema={formSchema} onSubmit={data => this.submit(data)}>
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField name='firstName' showInlineError={true} placeholder={'First Name'}/>
                <TextField name='lastName' showInlineError={true} placeholder={'Last Name'}/>
                <TextField name='email' showInlineError={true} placeholder={'email'} disabled/>
              </Form.Group>
              <LongTextField name='bio' placeholder='Talk about your dream or goal in music'/>
              <Form.Group widths={'equal'}>
                <TextField name='title' showInlineError={true} placeholder={'Phone number, etc'}/>
                <TextField name='picture' showInlineError={true} placeholder={'URL to picture'}/>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <MultiSelectField name='interests' showInlineError={true} placeholder={'Taste of music'}/>
                <MultiSelectField name='instruments' showInlineError={true} placeholder={'Instruments you play'}/>
                <MultiSelectField name='projects' showInlineError={true} placeholder={'Events'}/>
              </Form.Group>
              <SubmitField value='Change'/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
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
  return {
    ready: sub1.ready() && sub2.ready() && sub5.ready() && sub6.ready(),
  };
})(Home);
