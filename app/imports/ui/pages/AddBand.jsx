import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { ListField, AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { interestsName, Interests } from '../../api/interests/Interests';
import { Instruments, instrumentsName } from '../../api/instruments/instruments';
import { bandsName, Bands } from '../../api/bands/Bands';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests, allInstruments) => new SimpleSchema({
  name: String,
  positions: { type: Array, label: 'Positions', optional: false },
  'positions.$': { type: Object },
  'positions.$.name': { type: String },
  'positions.$.instrument': { type: String, allowedValues: allInstruments, optional: false },
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

/** Renders the Page for adding a document. */
class AddBand extends React.Component {

  /** On submit, insert the data. */
  submit({ name, positions, interests }, formRef) {
    Bands.insert(
      { name, positions, interests, owner: Meteor.userId(), applicants: [] },
      error => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Succesfully created Band', 'success')
            .then(formRef.reset);
        }
      },
    );
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const allInterests = _.pluck(Interests.find().fetch(), 'name');
    const allInstruments = _.pluck(Instruments.find().fetch(), 'name');
    const formSchema = makeSchema(allInterests, allInstruments);

    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Add Band</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <Form.Group widths={'equal'}>
                  <TextField name='name' showInlineError={true} placeholder='Band name'/>
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <MultiSelectField name='interests' showInlineError={true} placeholder={'Taste of Music'}/>
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <ListField name='positions' initialCount={1} />
                </Form.Group>
                <SubmitField value='Add Band'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

AddBand.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe(bandsName);
  const sub2 = Meteor.subscribe(interestsName);
  const sub3 = Meteor.subscribe(instrumentsName);
  return {
    ready: sub.ready() && sub2.ready() && sub3.ready(),
  };
})(AddBand);
