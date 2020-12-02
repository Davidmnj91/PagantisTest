package com.davidmnj91.pagantis.services;

import java.util.List;

import com.davidmnj91.pagantis.model.User;
import com.davidmnj91.pagantis.model.Wallet;
import com.davidmnj91.pagantis.repository.UserRepository;
import com.davidmnj91.pagantis.rest.CreditTransfer;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUser(final String id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalStateException("User " + id + " does not exists"));
    }

    public void transferCredit(CreditTransfer transference) {
        if(StringUtils.isBlank(transference.getFromWalletId()) || StringUtils.isBlank(transference.getToWalletId())) {
            throw new IllegalArgumentException("Wallet ids are required");
        }
        if(transference.getFromWalletId().equals(transference.getToWalletId())){
            throw new IllegalArgumentException("Wallet ids must be different");
        }
        final List<User> walletsUser = userRepository.findUserWithWalletId(transference.getFromWalletId());
        if(walletsUser.isEmpty()){
            throw new IllegalArgumentException(String.format("Cannot find any user with both wallets: %s, %s", transference.getFromWalletId(), transference.getToWalletId()));
        }
        if(walletsUser.size() > 1) {
            throw new IllegalArgumentException("From and to wallets must belong to the same user");
        }
        final User user = walletsUser.get(0);
        final Wallet fromWallet = user.getWallets().stream().filter(w -> w.getId().equals(transference.getFromWalletId())).findAny().get();
        final Wallet toWallet = user.getWallets().stream().filter(w -> w.getId().equals(transference.getToWalletId())).findAny().orElseThrow(() -> new IllegalArgumentException("From and to wallets must belong to the same user"));
        if(transference.getAmount() > fromWallet.getAmount()) {
            throw new IllegalArgumentException("Tranfer amount must not exceed wallet amount");
        }

        fromWallet.setAmount(fromWallet.getAmount()-transference.getAmount());
        toWallet.setAmount(toWallet.getAmount()+transference.getAmount());

        userRepository.save(user);
    }
}
