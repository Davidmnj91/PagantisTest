import { Box, Card, CardContent, Divider, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { User } from '../../models';

interface Props {
  userList: User[];
  onSelect: (user: User) => void;
}

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
  },
  userList: {
    padding: `${theme.spacing(2)}px 0`,
  },
  listTitle: {
    padding: `${theme.spacing(1)}px 0`,
  },
}));

const UserList: React.FunctionComponent<Props> = (props: Props) => {
  const { userList, onSelect } = props;
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        {!userList.length ? (
          <Typography variant="h5" className={classes.pageTitle}>
            No users registered
          </Typography>
        ) : (
          userList.map((u, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box className={classes.userList} onClick={() => onSelect(u)}>
                <Typography variant="h5" component="h2" className={classes.listTitle}>
                  {u.name}
                </Typography>
                <Typography color="textSecondary">Wallets: {u.wallets.length}</Typography>
              </Box>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;
