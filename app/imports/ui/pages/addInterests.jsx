import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Loader, Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { Interests } from '../../api/interests/Interests';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = () => new SimpleSchema({
  name: String,
});

/** Renders the Interests as a set of Cards. */
class AddInterestsPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  submit({ name }, fRef) {
    Interests.insert(
      { name },
      error => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Successfully added Interest')
            .then(fRef.reset);
        }
      },
    );

    fRef.reset();
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let fRef = null;
    const formSchema = makeSchema();

    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center" inverted>Add Musical Taste</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField name='name' showInlineError={true} placeholder='Interest name'/>
              </Form.Group>
              <SubmitField value='Add Taste'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

AddInterestsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => ({
  ready: true,
}))(AddInterestsPage);
