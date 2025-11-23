package com.banking.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtUtils.extractUsername(token);
        } catch (Exception ex) {
            // Token parsing failed — log and continue, let security handle anonymous/401
            log.debug("Invalid JWT token (parse): {}", ex.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        UserDetails userDetails;
        try {
            // loadUserByUsername can throw UsernameNotFoundException — catch it
            userDetails = userDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException ex) {
            log.debug("User from token not found: {} - {}", username, ex.getMessage());
            // don't treat as fatal here; continue filter chain as anonymous
            filterChain.doFilter(request, response);
            return;
        } catch (Exception ex) {
            // unexpected error while loading user — log and continue to avoid 500
            log.error("Error loading user from token: {}", ex.getMessage(), ex);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtUtils.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // store role/username as request attributes if you still need them
                String role = jwtUtils.extractRole(token);
                if (role != null) {
                    request.setAttribute("role", role);
                    request.setAttribute("username", username);
                }
            } else {
                log.debug("JWT token validation failed for user: {}", username);
            }
        } catch (Exception ex) {
            log.error("Unexpected error validating token for user {}: {}", username, ex.getMessage(), ex);
            // swallow error and continue — avoid 500
        }

        filterChain.doFilter(request, response);
    }
}