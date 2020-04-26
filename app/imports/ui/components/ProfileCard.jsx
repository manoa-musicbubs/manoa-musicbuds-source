import React from 'react';
import { Card, Image, Label, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';

/** Component for layout out a Profile Card. */
export const ProfileCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='right' size='mini' src={props.profile.picture} />
      <Card.Header>{props.profile.firstName} {props.profile.lastName}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.profile.title}</span>
      </Card.Meta>
      <Card.Meta>
        <span className='date'>{props.profile.email}</span>
      </Card.Meta>
      <Card.Description>
        <Header as='h5'>Goal and Dream</Header>
        {props.profile.bio}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Taste of Music</Header>
      {_.map(props.profile.interests,
        (interest, index) => <Label key={index} size='tiny' color='black'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Instruments</Header>
      {_.map(props.profile.instruments,
          (instruments, index) => <Label key={index} size='tiny' color='black'>{instruments}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Events</Header>
      {_.map(props.profile.projects, (project, index) => <Image key={index} size='mini' src={project}/>)}
    </Card.Content>
  </Card>
);

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};
