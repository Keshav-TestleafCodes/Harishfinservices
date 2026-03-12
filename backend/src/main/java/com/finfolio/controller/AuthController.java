package com.finfolio.controller;

import com.finfolio.dto.AuthResponse;
import com.finfolio.dto.LoginRequest;
import com.finfolio.entity.User;
import com.finfolio.repository.UserRepository;
import com.finfolio.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok(AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .role(user.getRole().name())
            .email(user.getEmail())
            .build());
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(org.springframework.security.core.Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        return ResponseEntity.ok(AuthResponse.builder()
            .username(user.getUsername())
            .role(user.getRole().name())
            .email(user.getEmail())
            .build());
    }
}
