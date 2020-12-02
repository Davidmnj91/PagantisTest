import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import React, { useReducer } from 'react';
import { User } from '../../models';
import { Optional } from '../../utils';
import Loader from './loader';

interface Props {
  user: User;
  onCancel: () => void;
}

const useStyles = makeStyles((theme) => ({
  halfWidth: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    margin: `${theme.spacing(2)}px 0`,
    gridGap: theme.spacing(1),
  },
}));

interface State {
  fromWalletId: string;
  toWalletId: string;
  amount: Optional<number>;
  submitting: boolean;
  error?: string;
  submitted: boolean;
}

type FormActions =
  | { type: 'SET_FROM'; payload: string }
  | { type: 'SET_TO'; payload: string }
  | { type: 'SET_AMOUNT'; payload: string }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'SUBMIT_SUCCESS' };

function reducer(state: State, action: FormActions): State {
  switch (action.type) {
    case 'SET_FROM':
      return { ...state, ...{ fromWalletId: action.payload, amount: null } };
    case 'SET_TO':
      return { ...state, ...{ toWalletId: action.payload } };
    case 'SET_AMOUNT':
      const number = parseFloat(action.payload) || 0;
      return { ...state, ...{ amount: number } };
    case 'SUBMIT':
      return { ...state, ...{ submitting: true } };
    case 'SUBMIT_ERROR':
      return { ...state, ...{ error: action.payload, submitting: false } };
    case 'SUBMIT_SUCCESS':
      return { ...state, ...{ submitting: false, submitted: true } };
    default:
      return state;
  }
}

const initialState = { fromWalletId: '', toWalletId: '', amount: null, submitting: false, submitted: false };

const CreditTransfer: React.FunctionComponent<Props> = (props: Props) => {
  const { user, onCancel } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const isValidAmount = () => {
    if (!state.fromWalletId || !state.amount) {
      return true;
    }
    const wallet = user.wallets.find((w) => w.id === state.fromWalletId);
    return !!wallet && state.amount <= wallet?.amount;
  };

  const isValid = () => {
    const { fromWalletId, toWalletId, amount } = state;
    return !!fromWalletId && !!toWalletId && !!amount && isValidAmount();
  };

  const doSubmit = () => {
    if (!isValid()) {
      return;
    }
    dispatch({ type: 'SUBMIT' });
    fetch(`${process.env.REACT_APP_BASE_URL}user/transfer`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(state as Pick<State, 'fromWalletId' | 'toWalletId' | 'amount'>),
    })
      .then((_) => dispatch({ type: 'SUBMIT_SUCCESS' }))
      .catch((e) => dispatch({ type: 'SUBMIT_ERROR', payload: e }));
  };

  const classes = useStyles();

  if (state.submitted) {
    const fromWallet = user.wallets.find((w) => w.id === state.fromWalletId);
    const toWallet = user.wallets.find((w) => w.id === state.toWalletId);
    const amount = (!!state.amount && state.amount) || 0;
    return (
      <Card>
        <CardHeader
          title="Success !!!"
          action={
            <IconButton title="Close" aria-label="Close" color="primary" onClick={onCancel}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          <div className={classes.container}>
            <Paper className={classes.halfWidth}>
              <AttachMoneyIcon style={{ color: fromWallet!.amount < 0 ? red[500] : green[500] }} fontSize="large" />
              <Typography variant="h5">{fromWallet?.name}</Typography>
              <Typography variant="h5">{fromWallet!.amount - amount}€</Typography>
            </Paper>
            <Paper className={classes.halfWidth}>
              <AttachMoneyIcon style={{ color: fromWallet!.amount < 0 ? red[500] : green[500] }} fontSize="large" />
              <Typography variant="h5">{toWallet!.name}</Typography>
              <Typography variant="h6">{toWallet!.amount + amount}€</Typography>
            </Paper>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.submitting) {
    <Loader />;
  }

  return (
    <Card>
      <CardHeader
        title={`Transfer Credit in ${user.name}`}
        action={
          <div>
            <IconButton
              title="Save"
              aria-label="Save"
              color="primary"
              disabled={!isValid()}
              type="submit"
              onClick={doSubmit}
            >
              <SaveIcon />
            </IconButton>
            <IconButton title="Close" aria-label="Close" color="primary" onClick={onCancel}>
              <CloseIcon />
            </IconButton>
          </div>
        }
      />
      <CardContent>
        <div className={classes.container}>
          <FormControl variant="outlined" className={classes.halfWidth}>
            <InputLabel id="fromWallet">Origin</InputLabel>
            <Select
              labelId="fromWallet"
              id="fromWalletSelect"
              label="Origin"
              value={state.fromWalletId}
              onChange={(e: any) => dispatch({ type: 'SET_FROM', payload: e.target.value })}
            >
              {user.wallets
                .filter((w) => state.toWalletId !== w.id)
                .map((w, i) => {
                  return (
                    <MenuItem key={i} value={w.id}>
                      {`${w.name} - ${w.amount}`}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.halfWidth}>
            <InputLabel id="toWallet">Destination</InputLabel>
            <Select
              labelId="toWallet"
              id="toWalletSelect"
              label="Destination"
              value={state.toWalletId}
              onChange={(e: any) => dispatch({ type: 'SET_TO', payload: e.target.value })}
            >
              {user.wallets
                .filter((w) => state.fromWalletId !== w.id)
                .map((w, i) => {
                  return (
                    <MenuItem key={i} value={w.id}>
                      {`${w.name} - ${w.amount}`}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <Collapse in={!!state.fromWalletId && !!state.toWalletId}>
          <FormControl fullWidth variant="outlined" error={!isValidAmount()}>
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <OutlinedInput
              id="amount"
              aria-describedby="amount-error-text"
              label="Amount"
              value={state.amount || ''}
              inputProps={{
                type: 'number',
                min: 0,
              }}
              onChange={(e: any) => dispatch({ type: 'SET_AMOUNT', payload: e.target.value })}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
            {!isValidAmount() && (
              <FormHelperText id="amount-error-text">Amount must be less than origin wallet amount</FormHelperText>
            )}
          </FormControl>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CreditTransfer;
