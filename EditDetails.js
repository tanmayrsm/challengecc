import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import MyButton from '../util/MyButton';

import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';

const styles = (theme) => ({
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
        useNextVariants: true
      },
      form: {
        textAlign: 'center'
      },
      image: {
        margin: '20px auto 20px auto'
      },
      pageTitle: {
        margin: '10px auto 10px auto'
      },
      textField: {
        margin: '10px auto 10px auto'
      },
      button: {
        marginTop: 20,
        position: 'relative'
      },
      customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
      },
      progress: {
        position: 'absolute'
      },
      invisibleSeparator: {
        border: 'none',
        margin: 4
      },
      visibleSeparator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
      },
      paper: {
        padding: 20
      },
      profile: {
        '& .image-wrapper': {
          textAlign: 'center',
          position: 'relative',
          '& button': {
            position: 'absolute',
            top: '80%',
            left: '70%'
          }
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
        },
        '& svg.button': {
          '&:hover': {
            cursor: 'pointer'
          }
        }
      },
      button: {
        float: 'right'
      }
})
 
class EditDetails extends Component {
    state = {
        bio : '',
        website: '',
        location: '',
        open : false
    };

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio : credentials.bio ? credentials.bio :'',
            website : credentials.website ? credentials.website :'',
            location : credentials.location ? credentials.location :''
        });
    };

    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    };
    handleClose = () => {
        this.setState({ open: false });
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    handleSubmit = () => {
        const userDetails = {
          bio: this.state.bio,
          website: this.state.website,
          location: this.state.location
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
      };

    
    componentDidMount(){
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    }
    
   
    
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Fragment>
                    {/* <Tooltip title = "Edit Details" placements = "top">
                        <IconButton onClick = {this.handleOpen} className = {classes.button}>
                            <EditIcon color = "primary"/>
                        </IconButton>
                    </Tooltip> */}

                    <MyButton tip = "Edit Details" onClick = {this.handleOpen} btnClassName = {classes.button}>
                      <EditIcon color = "primary"/>
                    </MyButton>

                    <Dialog open = {this.state.open} onClose = {this.handleClose} fullWidth maxWidth = "sm">
                        <DialogTitle>Edit your detials</DialogTitle>
                        <DialogContent>
                            <form>
                            <TextField
                                name="bio"
                                tpye="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="website"
                                tpye="text"
                                label="Website"
                                placeholder="Your personal/professinal website"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="location"
                                tpye="text"
                                label="Location"
                                placeholder="Where you live"
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                            Cancel
                            </Button>
                            <Button onClick={this.handleSubmit} color="primary">
                            Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            </div>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails : PropTypes.func.isRequired,
    classes : PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials : state.user.credentials
});

export default connect(mapStateToProps , { editUserDetails })(withStyles(styles)(EditDetails));
