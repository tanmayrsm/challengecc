import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import MyButton from '../../util/MyButton';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataAction';

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
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import dayjs from 'dayjs';

const styles = {
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
      }
}

class CommentForm extends Component {
    state = {
        body : '',
        errors: {}
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
          this.setState({ errors: nextProps.UI.errors });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
          this.setState({ body: '' });
        }
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.screamId, { body: this.state.body });
    };

    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (
        <Grid item sm={12} style={{ textAlign: 'center' }}>
            <form onSubmit={this.handleSubmit}>
            <TextField
                name="body"
                type="text"
                label="Comment on scream"
                error={errors.comment ? true : false}
                helperText={errors.comment}
                value={this.state.body}
                onChange={this.handleChange}
                fullWidth
                className={classes.textField}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
            >
                Submit
            </Button>
            </form>
            
        </Grid>
        ) : null;
        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment : PropTypes.func.isRequired,
    UI : PropTypes.object.isRequired,
    classes : PropTypes.object.isRequired,
    screamId : PropTypes.string.isRequired,
    authenticated : PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    UI : state.UI,
    authenticated : state.user.authenticated
})

export default connect(mapStateToProps , { submitComment })(withStyles(styles)(CommentForm));
