import { Meteor } from 'meteor/meteor';
import { interestsName, Interests } from '../../api/interests/Interests';
import { instrumentsName, Instruments } from '../../api/instruments/instruments';
import { profilesName, Profiles } from '../../api/profiles/Profiles';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsInterests, projectsInterestsName } from '../../api/projects/ProjectsInterests';

/** Define a publication to publish all interests. */
Meteor.publish(interestsName, () => Interests.find());

Meteor.publish(instrumentsName, () => Instruments.find());

/** Define a publication to publish all profiles. */
Meteor.publish(profilesName, () => Profiles.find());

/** Define a publication to publish all projects. */
Meteor.publish(projectsName, () => Projects.find());

/** Define a publication to publish this collection. */
Meteor.publish(projectsInterestsName, () => ProjectsInterests.find());
