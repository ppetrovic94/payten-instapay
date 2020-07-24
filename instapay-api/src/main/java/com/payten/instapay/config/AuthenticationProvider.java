package com.payten.instapay.config;

import java.util.Optional;

import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationProvider.class);

    @Autowired
    private UserService userService;

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                  UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {
        //
    }

    @Override
    protected UserDetails retrieveUser(String userName,
                                       UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {

//        Object token = usernamePasswordAuthenticationToken.getCredentials();
//        //LOGGER.info("Token={}", token);
//        try {
//            return (UserDetails) Optional.ofNullable(token).map(String::valueOf).flatMap(userService::findByAccessToken)
//                    .orElseThrow(
//                            () -> new UsernameNotFoundException("Cannot find user with authentication token=" + token));
//        } catch (Throwable throwable) {
//            throwable.printStackTrace();
//        }

//        String username = usernamePasswordAuthenticationToken.getName();
        UserDetails userDetails = userService.loadUserByUsername(userName);
        if (userDetails != null) {
            return userDetails;
        } else {
            throw new RequestedResourceNotFoundException("Korisnik sa korisničkim imenom " + userName + " ne postoji.");
        }

        //return null;
    }
}
