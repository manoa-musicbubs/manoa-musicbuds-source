import React from 'react';
import { Card, Image, Label, Header, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';

/** Component for layout out a Profile Card. */
class ProfileCard extends React.Component {

  removeItem = (docID) => {
    console.log('item to delete is: ${docID}');
    this.props.Profiles.remove(docID);
  }

  render() {
    return (
  <Card>
    <Card.Content>
      <Image floated='right' size='mini' src={this.props.profile.picture} />
      <Card.Header>{this.props.profile.firstName} {this.props.profile.lastName}</Card.Header>
      <Card.Meta>
        <span className='date'>{this.props.profile.title}</span>
      </Card.Meta>
      <Card.Meta>
        <span className='date'>{this.props.profile.email}</span>
      </Card.Meta>
      <Card.Description>
        <Header as='h5'>Goal and Dream</Header>
        {this.props.profile.bio}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Taste of Music</Header>
      {_.map(this.props.profile.interests,
        (interest, index) => <Label key={index} size='tiny' color='black'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Instruments</Header>
      {_.map(this.props.profile.instruments,
          (instruments, index) => <Label key={index} size='tiny' color='black'>{instruments}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Events</Header>
      {_.map(this.props.profile.projects, (project, index) => <Image key={index} size='mini' src={project}/>)}
    </Card.Content>
    <Card.Content extra>
      <Button onClick={() => this.removeItem(this.props.profile._id)} floated='right'>Delete</Button>
    </Card.Content>
  </Card>
    );
  }
}

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ProfileCard);
