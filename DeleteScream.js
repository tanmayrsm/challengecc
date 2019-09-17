import React, { Component ,Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Button  from '@material-ui/core/Button';
import Dialog  from '@material-ui/core/Dialog';
import DialogTitle  from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/Delete';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataAction';
import { likeScream ,unlikeScream } from '../../redux/actions/dataAction';
import MyButton from '../../util/MyButton';

const styles = {
    deleteButton : {
        left : '90%',
        top : '10%',
        position : 'absolute'
    }
}
class DeleteScream extends Component {
    state = {
        open:false
    };
    handleOpen = () => {
        this.setState({ open: true })
    }
    handleClose = () => {
        this.setState({ open: false })
    }
    deleteScream = () => {
        this.props.deleteScream(this.props.screamId);
        this.setState({ open : false });
    }
    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <MyButton tip = "Delete scream" onClick = {this.handleOpen} btnClassName = {classes.deleteButton}>
                    <DeleteOutline color = "secondary" />
                </MyButton>
                <Dialog open = {this.state.open} onClose = {this.handleClose} fullWidth maxWidth = "sm">
                    <DialogTitle>Are you sure you want to delete this post ?</DialogTitle>
                    <DialogActions>
                        <Button onClick = {this.handleClose} color = "primary">Cancel</Button>
                        <Button onClick = {this.deleteScream} color = "secondary">Delete</Button>
                        

                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}
DeleteScream.propTypes = {
    deleteScream : PropTypes.func.isRequired,
    classes : PropTypes.object.isRequired,
    screamId : PropTypes.string.isRequired
} 

export default connect(null , {deleteScream })(withStyles(styles)(DeleteScream));
