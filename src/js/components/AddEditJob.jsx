import { browserHistory } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import AddJobStyle from '../../assets/style/addJobStyle';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import httpHelper from '../helpers/httpHelper';
import Message from '../common/Message.jsx';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Spinner from 'react-spinkit';
import TextBox from '../common/TextBox.jsx';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';

class AddEditJob extends React.Component {
    static cancel() {
        browserHistory.push('/');
    }

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.submitSuccess = this.submitSuccess.bind(this);
        this.setErrorValue = this.setErrorValue.bind(this);
        this.requestFailure = this.requestFailure.bind(this);
        this.handleCloseMessage = this.handleCloseMessage.bind(this);

        this.state = {
            jobType: '',
            location: '',
            jobCode: '',
            experience: '',
            openings: 1,
            requirement: '',
            loading: false,
            errorMessage: '',
            successMessage: '',
            header: 'Add a Job Posting',
        };
    }

    componentWillMount() {
        const { targettedJob } = this.props;

        if (targettedJob) {
            this.setState({
                header: 'Edit the Job Posting',
                jobType: targettedJob.job_type,
                location: targettedJob.location,
                jobCode: targettedJob.job_code,
                experience: targettedJob.experience,
                openings: targettedJob.openings,
                requirement: targettedJob.requirement,
            });
        }
    }

    /**
     * On Change event of the form.
     * @param  {Object} event [Event object of onChange.]
     * @return {[type]}       [description]
     */
    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    /**
     * [Set the emailIsValid and passwordIsValid state values.
     * Used to check before login.]
     * @param {[string]} fieldName ['emailIsValid' or 'passwordIsValid']
     * @param {[boolean]} value    [The value of fieldName parameter]
     */
    setErrorValue(fieldName, value) {
        this.setState({ [fieldName]: value });
    }

    /**
     * Submit Event
     */
    submit() {
        const {
            jobType, location, jobCode,
            experience, openings, requirement,
        } = this.state;
        const { targettedJob } = this.props;
        const data = {
            jobType,
            location,
            jobCode,
            experience,
            openings,
            requirement,
        };
        let url = '/api/insertNewJobData';

        if (targettedJob) {
            url = '/api/editJobData';
            data.id = targettedJob.id;
        }

        const submitJobPostObj = {
            url,
            data,
        };

        this.setState({ loading: true, successMessage: '', errorMessage: '' });
        httpHelper(submitJobPostObj, this.submitSuccess, this.requestFailure);
    }

    /**
     * HTTP Request Response.
     * @param  {[Object]} resp [Success Response.]
     */
    submitSuccess(resp) {
        if (resp.status === 200) {
            let message = 'Congrats! New Job Application is posted.';

            if (this.props.targettedJob) {
                message = 'Congrats! Selected Job Application is updated.';
            }

            this.setState({
                loading: false,
                errorMessage: '',
                successMessage: message,
            }, () => {
                setTimeout(() => { browserHistory.push('/'); }, 1500);
            });
        } else {
            this.requestFailure(resp);
        }
    }

    /**
     * Handle Close Event
     */
    handleCloseMessage() {
        this.setState({
            loading: false,
            errorMessage: '',
            successMessage: '',
        });
    }

    /**
     * Handles the HTTP request failure.
     * @param  {Object} response [With Error info.]
     */
    requestFailure(error) {
        this.setState({ loading: false, errorMessage: error.message });
    }

    render() {
        let error = null;
        let loadingState = null;

        const { classes } = this.props;
        const { errorMessage, successMessage, header } = this.state;

        if (errorMessage || successMessage) {
            let message = errorMessage;
            let color = '#d32f2f';

            if (successMessage) {
                message = successMessage;
                color = '#43a047';
            }

            error = (
                <Message
                    message={message}
                    handleClose={this.handleCloseMessage}
                    color={color}
                />
            );
        }

        if (this.state.loading) {
            loadingState = (
                <div className={classes.overlay}>
                    <Spinner
                        className={classes.spinner}
                        name="chasing-dots"
                        fadeIn="none"
                        color="black"
                    />
                </div>
            );
        }

        return (
            <div>
                {loadingState}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            {header}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid
                    container
                    className={classes.root}
                    alignItems="center"
                    direction="column"
                    justify="center"
                >
                    <Grid item xs={12} md={8} lg={6} xl={6} className={classes.paper_form}>
                        <Paper className={classes.paper_box} elevation={1}>
                            <TextBox
                                id="jobType"
                                name="jobType"
                                label="Job Type"
                                onChange={this.onChange}
                                value={this.state.jobType}
                                defaultValue={this.state.jobType}
                                placeholder="Job Type"
                                validationType="mandatory"
                                maxLength={200}
                                autoComplete="off"
                                disabled={false}
                                setErrorValue={this.setErrorValue}
                                containerClass=""
                            />
                            <TextBox
                                id="location"
                                name="location"
                                label="Location Type"
                                onChange={this.onChange}
                                value={this.state.location}
                                defaultValue={this.state.location}
                                placeholder="Job Location"
                                validationType="mandatory"
                                maxLength={200}
                                autoComplete="off"
                                disabled={false}
                                setErrorValue={this.setErrorValue}
                                containerClass=""
                            />
                            <TextBox
                                id="jobCode"
                                name="jobCode"
                                label="Job Code"
                                onChange={this.onChange}
                                value={this.state.jobCode}
                                defaultValue={this.state.jobCode}
                                placeholder="Job Code"
                                validationType="mandatory"
                                maxLength={200}
                                autoComplete="off"
                                disabled={false}
                                setErrorValue={this.setErrorValue}
                                containerClass=""
                            />
                            <TextBox
                                id="openings"
                                name="openings"
                                label="Openings"
                                type="number"
                                onChange={this.onChange}
                                value={this.state.openings}
                                defaultValue={this.state.openings}
                                placeholder="Job Code"
                                validationType="mandatory"
                                maxLength={200}
                                autoComplete="off"
                                disabled={false}
                                setErrorValue={this.setErrorValue}
                                containerClass=""
                            />
                            <TextBox
                                id="experience"
                                name="experience"
                                label="Experience"
                                onChange={this.onChange}
                                value={this.state.experience}
                                defaultValue={this.state.experience}
                                placeholder="Experience"
                                validationType="mandatory"
                                maxLength={200}
                                autoComplete="off"
                                disabled={false}
                                setErrorValue={this.setErrorValue}
                                containerClass=""
                            />
                            <TextBox
                                id="requirement"
                                name="requirement"
                                label="Requirement"
                                onChange={this.onChange}
                                value={this.state.requirement}
                                defaultValue={this.state.requirement}
                                placeholder="Requirement"
                                validationType="mandatory"
                                maxLength={8000}
                                autoComplete="off"
                                disabled={false}
                                setErrorValue={this.setErrorValue}
                                containerClass=""
                                multiline
                                rows={1}
                                rowsMax={4}
                            />
                            <center>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="button"
                                    onClick={AddEditJob.cancel}
                                    className={classes.submit_btn}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    onClick={this.submit}
                                    className={classes.submit_btn}
                                >
                                    Submit
                                </Button>
                            </center>
                        </Paper>
                    </Grid>
                </Grid>
                {error}
            </div>
        );
    }
}

AddEditJob.propTypes = {
    classes: PropTypes.object.isRequired,
    targettedJob: PropTypes.object,
};

AddEditJob.defaultProps = {
    targettedJob: null,
};

export default withStyles(AddJobStyle)(AddEditJob);
