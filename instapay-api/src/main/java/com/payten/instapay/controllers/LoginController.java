package com.payten.instapay.controllers;

import com.payten.instapay.dto.User.LoginRequest;
import com.payten.instapay.exceptions.handlers.AccessDeniedException;
import com.payten.instapay.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.security.Principal;
import java.util.Collection;
import java.util.Set;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@RestController
@RequestMapping(produces = "application/json")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public LoginController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/api/login")
    @ResponseStatus(HttpStatus.OK)
    public Collection<? extends GrantedAuthority> login(HttpServletRequest req, HttpServletResponse res, @RequestBody LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken authReq
                = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
        Authentication auth = authenticationManager.authenticate(authReq);
        Collection<? extends GrantedAuthority> grantedRoles = auth.getAuthorities();
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(auth);

        HttpSession session = req.getSession(true);
        session.setMaxInactiveInterval(3600);
        session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
        return grantedRoles;
    }

    @GetMapping("/api/isauth")
    @ResponseStatus(HttpStatus.OK)
    public String isAuthenticated(Principal currentUser){
        if (currentUser != null) {
            return currentUser.getName();
        } else throw new AccessDeniedException("Sessija ne postoji ili je istekla");
    }

    @GetMapping("/api/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(HttpServletRequest req, HttpServletResponse res){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HttpSession session = req.getSession(false);
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(req, res, auth);
        }
    }

    @GetMapping("/api/currentroles")
    @ResponseStatus(HttpStatus.OK)
    public Set<String> getUserRoles(Principal currentUser) {
        if (currentUser == null) throw new AccessDeniedException("Sessija ne postoji ili je istekla");
        return userService.getRolesForCurrentUser(currentUser.getName());
    }


}
