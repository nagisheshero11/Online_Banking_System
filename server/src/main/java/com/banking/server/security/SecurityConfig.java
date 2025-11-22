package com.banking.server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(
                        new com.banking.server.config.CorsConfig().corsConfigurationSource()
                ))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // ⭐ CORS PRE-FLIGHT FIX
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        // Public
                        .requestMatchers("/api/user/signup", "/api/user/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/setup/superadmin").permitAll()

                        // Loans
                        .requestMatchers(HttpMethod.POST, "/api/loans/apply")
                        .hasAuthority("USER")

                        .requestMatchers(HttpMethod.GET, "/api/loans/my")
                        .hasAuthority("USER")

                        // Admin APIs
                        .requestMatchers("/api/admin/**")
                        .hasAuthority("ADMIN")

                        // Bills
                        .requestMatchers(HttpMethod.POST, "/api/bills/create").permitAll()
                        .requestMatchers("/api/bills/**").authenticated()

                        // Other authenticated APIs
                        .requestMatchers("/api/user/**").authenticated()
                        .requestMatchers("/api/account/**").authenticated()
                        .requestMatchers("/api/transfer/**").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()

                        .anyRequest().authenticated()
                )

                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}