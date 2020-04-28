import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown, Container, Loader, Card, Label, Header, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { Bands, bandsName } from '../../api/bands/Bands';

const BandCard = ({ band }) => {
  return <Card>
    <Card.Content>
      <Card.Header>{band.name}</Card.Header>
    </Card.Content>
      <Card.Content extra>
        <Header as='h5'>Positions</Header>
        {band.positions.map((pos, index) =>
          pos.profileId ?
          <Label key={index} size='tiny' color='black'>{pos.name} ({ Profiles.findOne({ _id: pos.profileId }).email })</Label> :
          <Label key={index} size='tiny' color='black'>{pos.name}</Label>
      )}
      </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Interests</Header>
      {band.interests.map((interest, index) => <Label key={index} size='tiny' color='black'>{interest}</Label>)}
    </Card.Content>
    { Meteor.user() ?
      <Card.Content extra>
        <Header as='h5'>Apply</Header>
        <Dropdown multiple selection placeholder={"Apply for position"} options={
            band.positions.map(({name, instrument}) => ({
              key: name, value: name, text: `${name} (${instrument})`,
            })
          )}
          onChange={(_, data) => {
            const { value } = data;

            const profile = Profiles.findOne({ email: Meteor.user().username });

            const applicants = [
              ...(band.applicants.filter(x => x.profileId !== profile._id)),
              ...(value.map(v => ({ profileId: profile._id, position: v }))),
            ];

            Bands.update(
              { _id: band._id },
              { $set: { applicants } },
            );
          }}
        />
      </Card.Content> :
      null }
  </Card>;
};

/** Renders the Profile Collection as a set of Cards. */
class ProfilesPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const bands = Bands.find({}).fetch();

    return (
      <Container>
        <Card.Group>
          {_.map(bands, (band, index) => <BandCard key={index} band={band}/>)}
        </Card.Group>
      </Container>
    );
  }
}

ProfilesPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(profilesName);
  const sub4 = Meteor.subscribe(bandsName);
  return {
    ready: sub1.ready() && sub4.ready(),
  };
})(ProfilesPage);
