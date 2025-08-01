package com.example.controllers;

import com.example.model.User;
import com.example.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            // Check if email or mobile already exists
            Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists!");
            }

            userRepo.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during registration.");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> user = userRepo.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());

        if (user.isPresent()) {
            User loggedInUser = user.get();

            return ResponseEntity.ok().body(
                Map.of(
                    "message", "Login successful!",
                    "user", Map.of(
                        "id", loggedInUser.getId(),
                        "firstName", loggedInUser.getFirstName(),
                        "lastName", loggedInUser.getLastName(),
                        "email", loggedInUser.getEmail(),
                        "mobile", loggedInUser.getMobile()
                        
                ))
            );
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }
}
