import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom'
import Header from '../../components/Header/Header';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Help.css'


export default function CustomizedExpansionPanels() {
    const [expanded, setExpanded] = React.useState('none');

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            <Header />
            <div id="helpContainer">
                <h3>Here's some frequently asked questions to help you out!</h3>
                <br/>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')} style={{border :"none"}}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >How do I change my profile picture/bio/name/username/email/password?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Go to your profile tab (the last option on the bottom navigation bar) and 
                            click on the edit profile settings and choose the option you desire.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br/>
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')} style={{ border: "none" }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >What's the difference between a normal post and a timed post?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            A normal post remains on others' timeline and your profile forever. It can be viewed at any point.
                            <br/>
                            A timed post on the other hand lasts only for 24 hours. It has all the features of a normal post except the imminent expiry and doesn't show up on profile
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')} style={{ border: "none" }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >How do I disable comments on my post?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Choose the disable comments switch when you post something
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChange('panel4')} style={{ border: "none" }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >How do I mute a person?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            You can visit their profile and choose the mute option or click on the 3 dots on their post and choose mute.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel expanded={expanded === 'panel5'} onChange={handleChange('panel5')} style={{ border: "none" }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >How do I see the likes on my post?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            You can click the 3 dots menu on your post to view likes. Only you will be able to view the likes.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel expanded={expanded === 'panel6'} onChange={handleChange('panel6')} style={{ border: "none" }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >How do I text a friend?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Currently DMs are only through Telegram. If a user has enabled DMs by entering their Telegram Username in the account settings, you should see an option to DM them when you visit their profile
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br/>
                <ExpansionPanel expanded={expanded === 'panel7'} onChange={handleChange('panel7')} style={{ border: "none" }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography >How do I enable DMs?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Currently DMs are only through Telegram. To enable DMs, go to <a href="/settings">Settings</a> and enter your telegram username.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <p>For any other help, feel free to <Link to="/contactus">contact us</Link></p>
            </div>
        </div>
    );
}
