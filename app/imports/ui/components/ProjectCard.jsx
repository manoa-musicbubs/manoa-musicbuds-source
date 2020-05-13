import React from 'react';
import { Card, Image, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';

/** Component for layout out a Project Card. */
class ProjectCard extends React.Component {
  
  render() {
    return (
        <Card>
          <Card.Content>
            <Image floated='left' avatar src={this.props.project.picture}/>
            <Card.Header style={{ marginTop: '0px' }}>{this.props.project.name}</Card.Header>
            <Card.Meta>
              <span className='date'>{this.props.project.homepage}</span>
            </Card.Meta>
            <Card.Description>
              {this.props.project.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Header as='h5'>Who is inside</Header>
            {_.map(this.props.project.participants, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
          </Card.Content>
        </Card>
    );
  }
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ProjectCard);
