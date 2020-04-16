  import React from 'react';
import { Grid, Icon, Header } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className='digits-background'>
        <Grid container stackable centered columns={1}>
          <Grid.Column textAlign='center'>
            <Icon size='huge' name='play' inverted/>
            <Header as='h1' inverted >Together, we Better.</Header>
          </Grid.Column>
        </Grid>
        </div>
    );
  }
}

export default Landing;
