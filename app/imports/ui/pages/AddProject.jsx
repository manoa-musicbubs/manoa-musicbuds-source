import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, DateField, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { addProjectMethod } from '../../startup/both/Methods';
import { interestsName, Interests } from '../../api/interests/Interests';
import { projectsName } from '../../api/projects/Projects';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  name: String,
  description: String,
  homepage: String,
  picture: String,
  date: Date,
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

/** Renders the Page for adding a document. */
class AddProject extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    Meteor.call(addProjectMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Project added successfully', 'success').then(() => formRef.reset());
      }
    });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const allInterests = _.pluck(Interests.find().fetch(), 'name');
    const formSchema = makeSchema(allInterests);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Add Events</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <Form.Group widths={'equal'}>
                  <TextField name='name' showInlineError={true} placeholder='Events name'/>
                  <TextField name='picture' showInlineError={true} placeholder='Event picture URL'/>
                  <TextField name='homepage' showInlineError={true} placeholder='Events Homepage URL'/>
                  <DateField name='date' showInlineError={true} placeholder='Event Date'/>
                </Form.Group>
                <LongTextField name='description' placeholder='Describe the project here'/>
                <Form.Group widths={'equal'}>
                  <MultiSelectField name='interests' showInlineError={true} placeholder={'Taste of Music'}/>
                </Form.Group>
                <SubmitField value='Add Event'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

AddProject.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(interestsName);
  const sub5 = Meteor.subscribe(projectsName);
  return {
    ready: sub1.ready() && sub5.ready(),
  };
})(AddProject);
