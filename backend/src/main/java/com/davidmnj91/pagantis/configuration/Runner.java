package com.davidmnj91.pagantis.configuration;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.davidmnj91.pagantis.model.User;
import com.davidmnj91.pagantis.model.Wallet;
import com.davidmnj91.pagantis.repository.UserRepository;
import com.github.javafaker.Faker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Runner implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(Runner.class);

    @Autowired
    private UserRepository userRepository;

    private Faker faker = Faker.instance();

	@Override
	public void run(String... args) throws Exception {
        long existingData = userRepository.count();
        
        if(existingData == 0) {
            final int amountEntities = 10;

            List<User> users = buildUsers(amountEntities).stream().map(u -> {
                List<Wallet> wallets = buildWallets(amountEntities);
                u.setWallets(wallets);
                return u;
            }).collect(Collectors.toList());

            userRepository.saveAll(users).forEach(u -> logger.info(u.toString()));
        }
    }

    private List<User> buildUsers(int amount) {
        return IntStream.range(0,amount).mapToObj(i -> 
            User.builder()
            .id(randomId())
            .name(faker.funnyName().name())
            .build()
        ).collect(Collectors.toList());
    }

    private List<Wallet> buildWallets(int amount) {
        return IntStream.range(0,amount).mapToObj(i -> 
            Wallet.builder()
            .id(randomId())
            .name(faker.pokemon().name())
            .amount(faker.number().randomDouble(2, 9999, -2999))
            .build()
        ).collect(Collectors.toList());
    }
    
    private String randomId() {
        return UUID.randomUUID().toString();
    }
}
