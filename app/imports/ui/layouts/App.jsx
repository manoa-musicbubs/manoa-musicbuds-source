import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import Home from '../pages/Home';
import Profiles from '../pages/Profiles';
import Lucky from '../pages/Lucky';
import AddProject from '../pages/AddProject';
import Projects from '../pages/Projects';
import UpcomingProjects from '../pages/UpcomingProjects';
import AddBand from '../pages/AddBand';
import Bands from '../pages/Bands';
import ManageBands from '../pages/ManageBands';
import Filter from '../pages/Filter';
import Interests from '../pages/Interests';
import addInterests from '../pages/addInterests';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import YourMusicBubs from '../pages/YourMusicBubs';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';


/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 0 }}>
          <NavBar style={{ flexGrow: 0 }} />
          <div style={{ paddingTop: '20px', paddingBottom: '30px', flexGrow: 1, minHeight: 'calc(100% - 50px)' }}>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <ProtectedRoute path="/home" component={Home}/>
              <Route path="/profiles" component={Profiles}/>
              <Route path="/projects" component={Projects}/>
              <Route path="/upcoming" component={UpcomingProjects}/>
              <Route path="/lucky" component={Lucky}/>
              <Route path="/interests" component={Interests}/>
              <Route path="/addInterests" component={addInterests}/>
              <ProtectedRoute path="/addproject" component={AddProject}/>
              <ProtectedRoute path="/addBand" component={AddBand}/>
              <Route path="/bands" component={Bands}/>
              <ProtectedRoute path="/manageBands" component={ManageBands}/>
              <Route path="/filter" component={Filter}/>
              <ProtectedRoute path="/yourmusicbubs" component={YourMusicBubs}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
          <Footer style={{ flexGrow: 0 }}/>
        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
