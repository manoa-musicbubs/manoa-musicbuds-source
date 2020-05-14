import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Responsive, Menu, Dropdown, Header, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

const FullNavBar = props => {
    const menuStyle = { marginBottom: '0px' };
    return (
      <Menu style={menuStyle} attached="top" borderless inverted color='#016936'>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <Header inverted as='h1'><Icon name="music"></Icon>ManoaMusicBuds</Header>
        </Menu.Item>
        {props.currentUser ? (
          <Menu.Item as={NavLink} activeClassName="active" exact to="/home" key='home'>Your Profile</Menu.Item>
        ) : ''}

          <Dropdown item text="Musicbuds">
            <Dropdown.Menu>
              <Menu.Item as={NavLink} activeClassName="active" exact to="/profiles" key='profiles'>
                <Icon name="plus"></Icon>All Musicbubs
              </Menu.Item>
              <Menu.Item as={NavLink} activeClassName="active" exact to="/filter" key='filter'>
                Find Match
              </Menu.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text="Events">
            <Dropdown.Menu>
              <Menu.Item as={NavLink} activeClassName="active" exact to="/projects" key='projects'><Icon name="heart outline"></Icon>Events</Menu.Item>

              { props.currentUser ? (
                <Menu.Item as={NavLink} activeClassName="active" exact to="/addProject" key='addP'>
                  Add Event
                </Menu.Item>) : null }

              { props.currentUser ? (
                <Menu.Item as={NavLink} activeClassName="active" exact to="/upcoming" key='upcoming'>
                  Upcoming Events
                </Menu.Item>) : null }

            </Dropdown.Menu>
          </Dropdown>

          { props.currentUser ?
              <Dropdown item text="Bands">
                <Dropdown.Menu>
                  <Menu.Item as={NavLink} activeClassName="active" exact to="/bands" key='bands'>All Bands</Menu.Item>
                  <Menu.Item as={NavLink} activeClassName="active" exact to="/addBand" key='addBand'>
                    Add Band
                  </Menu.Item>
                  <Menu.Item as={NavLink} activeClassName="active" exact to="/manageBands" key='manageBands'>
                    Manage Bands
                  </Menu.Item>
                </Dropdown.Menu>
              </Dropdown> :

              <Menu.Item as={NavLink} activeClassName="active" exact to="/bands" key='bands'>All Bands</Menu.Item>
          }

        <Dropdown item text="Misc">
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} activeClassName="active" exact to="/interests" key='interests'>
              Taste of Music
            </Dropdown.Item>

            <Dropdown.Item as={NavLink} activeClassName="active" exact to="/addInterests" key='addInterests'>
              Add Musical Tastes
            </Dropdown.Item>

            <Dropdown.Item as={NavLink} activeClassName="active" exact to="/lucky" key='lucky'>
              Feeling Lonely?
            </Dropdown.Item>

            { props.currentUser ? (
               <Dropdown.Item as={NavLink} activeClassName="active" exact to="/yourmusicbubs" key='yourmusicbubs'>
                 Added Musicbubs
               </Dropdown.Item>) : null }

          </Dropdown.Menu>
        </Dropdown>

        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <Menu.Item as={NavLink} activeClassName="active" exact to="/admin" key='admin'>Admin</Menu.Item>
        ) : ''}
          {props.currentUser === '' ? (
            <Dropdown pointing='right' item text="Login" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown pointing='right' item text={props.currentUser} icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          )}
      </Menu>
    );
};

FullNavBar.propTypes = {
  currentUser: PropTypes.string,
};

const MobileNavBar = props => {
    const menuStyle = { marginBottom: '0px' };
    return (
      <Menu style={menuStyle} attached="top" borderless inverted color='#016936'>
        <Dropdown text="Menu" fluid item>
          <Dropdown.Menu fluid vertical>

          <Dropdown.Item as={NavLink} activeClassName="" exact to="/">
            <Header as='h1'>ManoaMusicBuds</Header>
          </Dropdown.Item>

        {props.currentUser ? (
          <Dropdown.Item as={NavLink} activeClassName="active" exact to="/home" key='home'>Your Profile</Dropdown.Item>
        ) : ''}

        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/profiles" key='profiles'>
          All Musicbubs
        </Dropdown.Item>
        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/filter" key='filter'>
          Find Match
        </Dropdown.Item>

        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/projects" key='projects'>Events</Dropdown.Item>
          { props.currentUser ? <Dropdown.Item as={NavLink} activeClassName="active" exact to="/addProject" key='addP'>
              Add Event
            </Dropdown.Item> : null }

          { props.currentUser ? <Dropdown.Item as={NavLink}
            activeClassName="active" exact to="/upcoming" key='upcoming'>
            Upcoming Events
          </Dropdown.Item> : null }

        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/bands" key='bands'>All Bands</Dropdown.Item>
          { props.currentUser ? <Dropdown.Item as={NavLink} activeClassName="active" exact to="/addBand" key='addBand'>
            Add Band
          </Dropdown.Item> : null }
          { props.currentUser ? (
            <Dropdown.Item as={NavLink} activeClassName="active" exact to="/manageBands" key='manageBands'>
              Manage Bands
            </Dropdown.Item>) : null }

        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/interests" key='interests'>
          <Icon name="headphones"></Icon>Taste of Music
        </Dropdown.Item>

        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/addInterests" key='addInterests'>
          Add Musical Tastes
        </Dropdown.Item>

        <Dropdown.Item as={NavLink} activeClassName="active" exact to="/lucky" key='lucky'>
          Feeling Lonely?
        </Dropdown.Item>

        {props.currentUser ? (
          <Dropdown.Item as={NavLink} activeClassName="active" exact to="/yourmusicbubs" key='yourmusicbubs'>
            Added Musicbubs
          </Dropdown.Item>
        ) : null}

        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <Dropdown.Item as={NavLink} activeClassName="active" exact to="/admin" key='admin'>Admin</Dropdown.Item>
        ) : ''}

        {props.currentUser === '' ? (
          <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin"/>) :
        null }

        {props.currentUser === '' ? (
          <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>)
        : null }

        {props.currentUser !== '' ? (
          <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>)
        : null }

          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
};

MobileNavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const breakpoint = 900;

    return <div>
      <Responsive
        maxWidth={breakpoint}
        as={() => <MobileNavBar {...this.props} />} />
      <Responsive
        minWidth={breakpoint + 1}
        as={() => <FullNavBar {...this.props} />} />
    </div>;
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
