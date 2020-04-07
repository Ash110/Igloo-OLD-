import React from 'react'
import Header from '../../components/Header/Header';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function ContactUs() {
    return (
        <div>
            <Header />
            <div id="helpContainer">
                <h3 style={{textAlign : "center"}}>You can contact us for help, feedback or suggestions on any of the following platforms - </h3>
                <br/><br/>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                        <Card style={{ width: "80%" }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Good 'ol mail
                        </Typography>
                                <Typography variant="h5" component="h2">
                                    Write to us by mail
                        </Typography>
                                <Typography variant="body2" component="p">
                                    We'll try not to mark it as spam
                            <br /><br />
                                    <a href="mailto:igloosocialmedia@gmail.com">igloosocialmedia@gmail.com</a>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <a href="mailto:igloosocialmedia@gmail.com"><Button size="small">Send a mail!</Button></a>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>

                <br /><br />
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                        <Card style={{ width: "80%" }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    What should we add here?
                        </Typography>
                                <Typography variant="h5" component="h2">
                                    More ways coming soon...
                        </Typography>
                                <Typography variant="body2" component="p">
                                    Hopefully a more secure way to communicate than mail
                            <br /><br />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
