import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { Profiles } from '../../api/profiles/Profiles';
import { Interests } from '../../api/interests/Interests';
import { Instruments } from '../../api/instruments/instruments';

/* eslint-disable no-console */

const defaultProfile = ({ username }) => ({
  email: username,
  instruments: [],
  projects: [],
  interests: [],
});

Accounts.onCreateUser((options, user) => {
  Profiles.insert(defaultProfile(user));
  return user;
});

/** Define an interest.  Has no effect if interest already exists. */
function addInterest(interest) {
  Interests.update({ name: interest }, { $set: { name: interest } }, { upsert: true });
}

function addInstruments(instruments) {
  Instruments.update({ name: instruments }, { $set: { name: instruments } }, { upsert: true });
}

/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, password, role, profile) {
  const userID = Accounts.createUser({ username: email, email, password });

  if (role === 'admin') {
    Roles.addUsersToRoles(userID, 'admin');
  }

  if (profile) {
    Profiles.update(
      { email },
      { $set: { ...defaultProfile(email), ...profile, email } },
      { upsert: true },
    );

    // Make sure interests are defined in the Interests collection if they weren't already.
    profile.interests.forEach(addInterest);
    profile.instruments.forEach(addInstruments);
  }
}

if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.forEach(({ email, password, role, profile }) => {
      console.log(`creating user ${email}`);
      createUser(email, password, role, profile);
    });
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}

/** Define a new project. Error if project already exists.  */
function addProject({ name, homepage, description, interests, picture, participants }) {
  console.log(`Defining project ${name}`);
  Projects.insert({ name, homepage, description, picture, participants });
  interests.forEach(interest => ProjectsInterests.insert({ project: name, interest }));
  // Make sure interests are defined in the Interests collection if they weren't already.
  interests.forEach(addInterest);
}

/** Initialize DB if it appears to be empty (i.e. no users defined.) */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultProjects) {
    console.log('Creating the default projects');
    Meteor.settings.defaultProjects.forEach(addProject);
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }

  if (Meteor.settings.defaultInstruments) {
    Meteor.settings.defaultInstruments.foEach(addInstruments);
  }

  if (Meteor.settings.defaultInterests) {
    Meteor.settings.defaultInterests.foEach(addInterest);
  }
}

/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 * User count check is to make sure we don't load the file twice, which would generate errors due to duplicate info.
 */
if ((Meteor.settings.loadAssetsFile) && (Meteor.users.find().count() < 7)) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.projects.forEach(addProject);
}
