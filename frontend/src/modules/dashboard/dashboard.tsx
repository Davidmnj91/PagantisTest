import { Container, IconButton, makeStyles, Typography } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import React, { useEffect, useReducer } from 'react';
import { User } from '../../models';
import { Optional } from '../../utils';
import Loader from './loader';
import UserPanel from './user';
import UserList from './userList';

interface EntityState {
  collection: Record<string, User>;
  selected: Optional<string>;
  loading: boolean;
  error?: string;
}

type EntityActions =
  | { type: 'LOAD_ENTITIES' }
  | { type: 'SET_ENTITIES'; payload: User[] }
  | { type: 'SELECT_ONE'; payload?: Optional<User> }
  | { type: 'REFRESH' };

const reducer = (state: EntityState, action: EntityActions): EntityState => {
  switch (action.type) {
    case 'LOAD_ENTITIES':
      return { ...state, ...{ loading: true } };
    case 'SET_ENTITIES':
      const entities = action.payload.reduce((acc, u) => {
        acc[u.id] = u;
        return acc;
      }, {} as Record<string, User>);
      return { ...state, ...{ loading: false, collection: entities } };
    case 'SELECT_ONE':
      const id = (!!action.payload && action.payload.id) || null;
      return { ...state, ...{ selected: id } };
    case 'REFRESH':
      return initialState;
    default:
      return state;
  }
};

const initialState: EntityState = {
  collection: {},
  selected: null,
  loading: true,
};

const getEntities = (state: EntityState) => Object.values(state.collection);
const getSelected = (state: EntityState) => !!state.selected && state.collection[state.selected];

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  pageTitle: {
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
  },
}));

const DashBoard = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadUsers = () =>
    fetch(`${process.env.REACT_APP_BASE_URL}user`)
      .then((u) => u.json())
      .then((u) => dispatch({ type: 'SET_ENTITIES', payload: u }))
      .catch((_) => dispatch({ type: 'SET_ENTITIES', payload: [] }));

  useEffect(() => {
    loadUsers();
  }, []);

  const classes = useStyles();

  const header = (
    <div className={classes.titleContainer}>
      <Typography variant="h5" className={classes.pageTitle}>
        Users
      </Typography>
      <IconButton title="Refresh" aria-label="Refresh" color="primary" onClick={loadUsers}>
        <SyncIcon />
      </IconButton>
    </div>
  );

  if (state.loading) {
    return (
      <Container maxWidth="xl">
        {header}
        <Loader />
      </Container>
    );
  }

  if (state.selected) {
    return (
      <Container maxWidth="xl">
        <UserPanel user={getSelected(state) as User} onCancel={() => dispatch({ type: 'SELECT_ONE' })} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {header}
      <UserList userList={getEntities(state)} onSelect={(u: User) => dispatch({ type: 'SELECT_ONE', payload: u })} />
    </Container>
  );
};

export default DashBoard;
