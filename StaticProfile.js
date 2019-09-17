import React, { Fragment ,Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// MUI
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = {
    palette: {
        primary: {
          light: '#33c9dc',
          main: '#00bcd4',
          dark: '#008394',
          contrastText: '#fff'
        },
        secondary: {
          light: '#ff6333',
          main: '#ff3d00',
          dark: '#b22a00',
          contrastText: '#fff'
        }
      },
      typography: {
        useNextVariants : true
      },
      visibleSeparator : {
        width : '100%',
        borderBottom : '1px solid rgba(0,0,0,0.1)',
        marginBottom : 20
      },
      invisibleSeparator : {
          border : 'none',
          margin :4
      },
      profileImage: {
          maxWidth: 200,
          height: 200,
          borderRadius: '50%',
          objectFit: 'cover'
        },
        dialogContent: {
          padding: 20
        },
        closeButton: {
          position: 'absolute',
          left: '90%'
        },
        expandButton: {
          position: 'absolute',
          left: '90%'
        },
        spinnerDiv: {
          textAlign: 'center',
          marginTop: 50,
          marginBottom: 50
        },
          profile: {
            '& .image-wrapper': {
              textAlign: 'center',
              position: 'relative',
            },
            '& .profile-image': {
              width: 200,
              height: 200,
              objectFit: 'cover',
              maxWidth: '100%',
              borderRadius: '50%'
            },
            '& .profile-details': {
              textAlign: 'center',
              '& span, svg': {
                verticalAlign: 'middle'
              },
              '& a': {
                color: '#00bcd4'
              }
            },
            '& hr': {
              border: 'none',
              margin: '0 0 10px 0'
            }
          }
}
const StaticProfile = (props) => {
    const {
      classes,
      profile: { handle, createdAt, imageUrl, bio, website, location }
    } = props;
  
    return (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${handle}`}
              color="primary"
              variant="h5"
            >
              @{handle}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <Fragment>
                <LocationOn color="primary" /> <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {' '}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />{' '}
            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
          </div>
        </div>
      </Paper>
    );
  };

StaticProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(StaticProfile);