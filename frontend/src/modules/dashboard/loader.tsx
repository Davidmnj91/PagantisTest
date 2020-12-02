import { CircularProgress, makeStyles, Paper } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '220px',
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.loaderContainer}>
      <CircularProgress color="secondary" />
    </Paper>
  );
};

export default Loader;
