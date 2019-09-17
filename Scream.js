import React, { Component } from 'react'
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
import DeleteScream from './DeleteScream';
import { deleteScream } from '../../redux/actions/dataAction';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { likeScream ,unlikeScream } from '../../redux/actions/dataAction';
import MyButton from '../../util/MyButton';

//icons
import ChatIcon from '@material-ui/icons/Chat';

const styles = {
    card : {
        position : 'relative',
        display : 'flex',
        marginBottom : 20
    },
    image : {
        minWidth : 200
    },
    content :{
        padding : 25,
        objectFit : 'cover'
    }
}
class Scream extends Component {
    render() {
        dayjs.extend(relativeTime);
        const { classes ,scream : { body ,createdAt ,userImage ,userHandle ,screamId ,likeCount ,commentCount } 
        ,user:{
                authenticated,
                credentials:{
                    handle
                }
            },
        } = this.props;
        // const likeButton = !authenticated ? (
        //     <MyButton tip = "like">
        //         <Link to = "/login">
        //             <FavoriteBorder color  ="primary"/>
        //         </Link>
        //     </MyButton>
        // ):(
        //     this.likedScream() ? (
        //         <MyButton tip = "undo like" onClick ={this.unlikeScream}>
        //             <FavoriteIcon color = "primary"/>
        //         </MyButton>
        //     ):(
        //         <MyButton tip = "Like" onClick ={this.likeScream}>
        //             <FavoriteBorder color = "primary"/>
        //         </MyButton>
        //     )
        // );
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId = {screamId}/>
        ):null;
    
        return (
            <Card className = {classes.card}>
                <CardMedia image = { userImage } title = "Profile Image" className = {classes.image}/>
                    <CardContent className = {classes.content}>
                        <Typography variant = "h5" component = {Link} to = {`/users/${userHandle}`} color = "primary">{ userHandle }</Typography>
                        {deleteButton}
                        <Typography variant = "body2" color = "textSecondary">{ dayjs(createdAt).fromNow() }</Typography>
                        <Typography variant = "body1">{ body }</Typography>

                        <LikeButton screamId = { screamId }/>
                        
                        <span>{likeCount} Likes</span>
                        <MyButton tip = "comments">
                            <ChatIcon color = "primary"/>
                        </MyButton>
                        <span>{commentCount}</span>
                        <ScreamDialog screamId = {screamId} userHandle = {userHandle}  openDialog = {this.props.openDialog}/>
                    </CardContent>
            </Card>
        )
    }
}

Scream.propTypes = {
    // likeScream : PropTypes.func.isRequired,
    // unlikeScream  :PropTypes.func.isRequired,
    user : PropTypes.object.isRequired,
    scream : PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog : PropTypes.bool
}
 
const mapStateToProps =  state => ({
    user : state.user
})

const mapActionsToProps = {
    // likeScream,
    // unlikeScream,
    deleteScream
}

export default connect(mapStateToProps ,mapActionsToProps)(withStyles(styles)(Scream));
