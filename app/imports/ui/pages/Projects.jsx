import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { profilesName } from '../../api/profiles/Profiles';
import { Projects, projectsName } from '../../api/projects/Projects';
import { projectsInterestsName } from '../../api/projects/ProjectsInterests';
import { ProjectCard, getProjectData } from '../components/ProjectCard.jsx';

/** Renders the Project Collection as a set of Cards. */
class ProjectsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const projects = _.pluck(Projects.find().fetch(), 'name');
    const projectData = projects.map(project => getProjectData(project));
    return (
      <Container>
        <Card.Group>
          {_.map(projectData, (project, index) => <ProjectCard key={index} project={project}/>)}
        </Card.Group>
      </Container>
    );
  }
}

ProjectsPage.propTypes = {
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
})(ProjectsPage);
