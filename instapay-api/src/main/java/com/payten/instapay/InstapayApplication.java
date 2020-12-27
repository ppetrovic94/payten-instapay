package com.payten.instapay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import java.util.Properties;

@SpringBootApplication
public class InstapayApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(InstapayApplication.class).properties(loadproperties());
    }

    public static void main(String[] args) {
        SpringApplication.run(InstapayApplication.class, args);
    }

    private Properties loadproperties() {
        Properties props = new Properties();
        props.put("spring.config.location", "classpath:ips-api/");
        return props;
    }

}