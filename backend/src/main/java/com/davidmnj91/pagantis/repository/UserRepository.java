package com.davidmnj91.pagantis.repository;

import java.util.List;

import com.davidmnj91.pagantis.model.User;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends MongoRepository<User, String>{
    @Query(value = "{ 'wallets' : {$elemMatch : {_id: ?0 }}}")
    public List<User> findUserWithWalletId(final String walletId);
}
