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
    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(
        @PathVariable Long id,
        @RequestBody Map<String, String> request
    ) {
        Optional<User> optionalUser = userRepo.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }

        user.setPassword(newPassword);
        userRepo.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
    
    
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepo.findById(id).map(existingUser -> {
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setMobile(updatedUser.getMobile());
            

            userRepo.save(existingUser);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", existingUser));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        	    Map.of("message", "User not found")
        		));

    }



}
