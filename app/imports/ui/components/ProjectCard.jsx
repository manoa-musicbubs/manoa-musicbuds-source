import React from 'react';
import { Card, Image, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';

/** Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
export function getProjectData(name) {
  const data = Projects.findOne({ name });
  const profilePictures = _.pluck(
    Profiles.find({ projects: { $all: [name] } }).fetch(),
    'picture',
  );
  const interests = _.pluck(ProjectsInterests.find({ project: name }).fetch(), 'interest');

  return _.extend({ }, data, { interests, participants: profilePictures });
}

/** Component for layout out a Project Card. */
export const ProjectCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='left' avatar src={props.project.picture}/>
      <Card.Header style={{ marginTop: '0px' }}>{props.project.name}</Card.Header>
      <Card.Meta>
        <span className='date'>{
          props.project.date ? `${props.project.date.toLocaleDateString()
        }` : 'unkown date'}</span>
      </Card.Meta>
      <Card.Description>
        <a href={props.project.homepage}>{props.project.homepage}</a><br />
        {props.project.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Who is inside</Header>
      {_.map(props.project.participants, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
    </Card.Content>
  </Card>
);

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};
