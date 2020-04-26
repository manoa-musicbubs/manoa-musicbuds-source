import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = { marginBottom: '0px' };
    return (
      <Menu style={menuStyle} attached="top" borderless inverted color='#016936'>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <Header inverted as='h1'>ManoaMusicBuds</Header>
        </Menu.Item>
        {this.props.currentUser ? (
          <Menu.Item as={NavLink} activeClassName="active" exact to="/home" key='home'>Your info</Menu.Item>
        ) : ''}
        <Menu.Item as={NavLink} activeClassName="active" exact to="/profiles" key='profiles'>ALl Musicbubs</Menu.Item>
        <Menu.Item as={NavLink} activeClassName="active" exact to="/projects" key='projects'>Events</Menu.Item>
        <Menu.Item as={NavLink} activeClassName="active" exact to="/interests" key='interests'>Taste of Music</Menu.Item>
        <Menu.Item as={NavLink} activeClassName="active" exact to="/lucky" key='lucky'>
          Feeling Lonely?</Menu.Item>
        {this.props.currentUser ? (
            [<Menu.Item as={NavLink} activeClassName="active" exact to="/addProject" key='addP'>Add Event</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/filter" key='filter'>Find Match</Menu.Item>,
              <Menu.Item as={NavLink} activeClassName="active" exact to="/yourmusicbubs" key='yourmusicbubs'>Added Musicbubs</Menu.Item>]
        ) : ''}
        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <Menu.Item as={NavLink} activeClassName="active" exact to="/admin" key='admin'>Admin</Menu.Item>
        ) : ''}
        <Menu.Item position="right">
          {this.props.currentUser === '' ? (
            <Dropdown text="Login" pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter so that links work. */
export default withRouter(NavBarContainer);
