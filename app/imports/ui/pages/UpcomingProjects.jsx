import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsInterests, projectsInterestsName } from '../../api/projects/ProjectsInterests';

/** Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.findOne({ name });
  const profilePictures = _.pluck(
    Profiles.find({ projects: { $all: [name] } }).fetch(),
    'picture',
  );
  const interests = _.pluck(ProjectsInterests.find({ project: name }).fetch(), 'interest');

  return _.extend({ }, data, { interests, participants: profilePictures });
}

/** Component for layout out a Project Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='left' avatar src={props.project.picture}/>
      <Card.Header style={{ marginTop: '0px' }}>{props.project.name}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.project.date ? `${props.project.date.toLocaleDateString()}` : "unkown date"}</span>
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

MakeCard.propTypes = {
  project: PropTypes.object.isRequired,
};

/** Renders the Project Collection as a set of Cards. */
class UpcomingProjectsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let projects = Projects.find().fetch();
    projects = _.filter(projects, p => !!p.date);
    projects = _.filter(projects, p => new Date(p.date) > Date.now());
    projects = _.sortBy(projects, p => new Date(p.date));
    projects = _.pluck(projects, 'name');

    const projectData = projects.map(project => getProjectData(project));
    return (
      <Container>
        <Card.Group>
          {_.map(projectData, (project, index) => <MakeCard key={index} project={project}/>)}
        </Card.Group>
      </Container>
    );
  }
}

UpcomingProjectsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub2 = Meteor.subscribe(projectsName);
  const sub3 = Meteor.subscribe(projectsInterestsName);
  const sub4 = Meteor.subscribe(profilesName);

  return {
    ready: sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(UpcomingProjectsPage);