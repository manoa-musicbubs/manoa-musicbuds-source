import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SelectField from '../forms/controllers/SelectField';

const ManageBand = ({ band, schema, model, onSubmit }) => (
  <Grid container centered>
    <Grid.Column>
      <AutoForm model={model} schema={schema} onSubmit={onSubmit}>
        <Segment>
          <Header as="h2" textAlign="center">{band.name}</Header>
            { band.positions.map(pos => (
              <SelectField
                key={pos.name}
                name={pos.name}
                showInlineError={true}
                placeholder={pos.name} />))}
          <SubmitField value='Change'/>
        </Segment>
      </AutoForm>
    </Grid.Column>
  </Grid>
);

ManageBand.propTypes = {
  band: PropTypes.object.isRequred,
  schema: PropTypes.object.isRequred,
  model: PropTypes.object.isRequred,
  onSubmit: PropTypes.func.isRequred,
};

export default ManageBand;
