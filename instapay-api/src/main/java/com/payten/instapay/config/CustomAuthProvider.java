package com.payten.instapay.config;

import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.model.User;
import com.payten.instapay.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class CustomAuthProvider implements AuthenticationProvider {

    @Autowired
    UserService userService;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();
        User user = userService.findByUsernameAndPassword(username,password);
        if (user == null) {
            throw new RequestedResourceNotFoundException("Uneli ste pogrešno korisničko ime ili lozinku");
        }
        if (user.getIsApproved() == 0) {
            throw new RequestedResourceNotFoundException("Korisnik " + username + " je neaktivan");
        }

        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        return new UsernamePasswordAuthenticationToken(user, password, authorities);
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}