import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import React, { useState } from 'react';
import { User } from '../../models';
import CreditTransfer from './credit-transfer';

interface Props {
  user: User;
  onCancel: () => void;
}

const useStyles = makeStyles((theme) => ({
  walletList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const UserPanel: React.FunctionComponent<Props> = (props: Props) => {
  const { user, onCancel } = props;

  const [isTransfer, setTransfer] = useState(false);

  const classes = useStyles();

  if (isTransfer) {
    return <CreditTransfer user={user} onCancel={() => setTransfer(false)} />;
  } else {
    return (
      <Card>
        <CardHeader
          title={user.name}
          action={
            <div>
              <IconButton title="Transfer" aria-label="Transfer" color="primary" onClick={() => setTransfer(true)}>
                <SyncAltIcon />
              </IconButton>
              <IconButton title="Close" aria-label="Close" color="primary" onClick={onCancel}>
                <CloseIcon />
              </IconButton>
            </div>
          }
        />
        <CardContent>
          <List className={classes.walletList}>
            {user.wallets.map((w, i) => {
              return (
                <div key={i}>
                  {i > 0 && <Divider />}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <AttachMoneyIcon style={{ color: w.amount < 0 ? red[500] : green[500] }} fontSize="large" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={w.name} secondary={`${w.amount}€`} />
                  </ListItem>
                </div>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }
};

export default UserPanel;
