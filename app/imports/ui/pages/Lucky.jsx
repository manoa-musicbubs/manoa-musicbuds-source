import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProfileCard } from '../components/ProfileCard';

/** Returns the Profile and associated Projects and Interests associated with the passed user email. */
function getProfileData(email) {
  const data = Profiles.findOne({ email });
  const { interests, instruments, projects } = data;

  const projectPictures = projects.map(project => Projects.findOne({ name: project }).picture);

  return _.extend({ }, data, { interests, instruments, projects: projectPictures });
}

/** Renders the Profile Collection as a set of Cards. */
class LuckyPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const email = _.sample(_.pluck(Profiles.find().fetch(), 'email'));
    const profileData = getProfileData(email);

    return (
      <Container>
        <Card.Group>
         <ProfileCard profile={profileData}/>
        </Card.Group>
      </Container>
    );
  }
}

LuckyPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(profilesName);
  const sub5 = Meteor.subscribe(projectsName);
  return {
    ready: sub1.ready() && sub5.ready(),
  };
})(LuckyPage);
