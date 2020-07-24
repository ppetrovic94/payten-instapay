package com.payten.instapay.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;


public class AuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    public AuthenticationFilter(final RequestMatcher requiresAuth) {
        super(requiresAuth);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest,
                                                HttpServletResponse httpServletResponse) throws AuthenticationException, IOException, ServletException {
//		Optional tokenParam = Optional.ofNullable(httpServletRequest.getHeader("YABX_ACCESS_TOKEN")); // Authorization:
        SecurityContext securityContext = (SecurityContext) httpServletRequest.getSession().getAttribute(SPRING_SECURITY_CONTEXT_KEY);
        //Authentication requestAuthentication = new UsernamePasswordAuthenticationToken(activeSession.get., token);
        return getAuthenticationManager().authenticate(securityContext.getAuthentication());

    }

    @Override
    protected void successfulAuthentication(final HttpServletRequest request, final HttpServletResponse response,
                                            final FilterChain chain, final Authentication authResult) throws IOException, ServletException {
        SecurityContextHolder.getContext().setAuthentication(authResult);
        chain.doFilter(request, response);
    }
}
