package com.davidmnj91.pagantis.configuration;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfiguration extends AbstractMongoClientConfiguration {
    
	@Value("${spring.data.mongodb.host}")
	private String host;

	@Value("${spring.data.mongodb.port}")
    private int port;

    @Value("${spring.data.mongodb.username}")
	private String username;

	@Value("${spring.data.mongodb.password}")
    private String password;

    @Value("${spring.data.mongodb.database}")
    private String database;
    
    @Value("${spring.data.mongodb.authentication-database}")
    private String auth_database;

    
    @Override
    public MongoClient mongoClient() {
        final String connection = "mongodb://"+username+":"+password+"@"+host+":"+port+"/"+database+"?authSource="+auth_database;
        ConnectionString connectionString = new ConnectionString(connection);
        
        MongoClientSettings settings = MongoClientSettings.builder()
        .applyConnectionString(connectionString)
        .build();

        return MongoClients.create(settings);
    }

	@Override
	protected String getDatabaseName() {
		return database;
	}
    
}
