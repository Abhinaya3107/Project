package com.example.controllers;

import com.example.model.User;
import com.example.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        try {
            // Handle validation errors
            if (bindingResult.hasErrors()) {
                List<Map<String, String>> errors = bindingResult.getFieldErrors().stream()
                        .map(error -> Map.of(
                                "field", error.getField(),
                                "defaultMessage", error.getDefaultMessage()))
                        .toList();

                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }

            // Check if email already exists
            Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("errors", List.of(
                    Map.of("field", "email", "defaultMessage", "Email already exists!")
                )));
            }

            userRepo.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("errors", List.of(
                        Map.of("field", "general", "defaultMessage", "Error during registration.")
                    )));
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

////////////////////Forgot-password////////////////////

//✅ FORGOT PASSWORD: Check if email exists
@PostMapping("/forgot-password/check")
public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> payload) {
String email = payload.get("email").trim().toLowerCase();
Optional<User> userOpt = userRepo.findByEmail(email);

return ResponseEntity.ok(Map.of("exists", userOpt.isPresent()));
}

//✅ FORGOT PASSWORD: Reset password
@PostMapping("/forgot-password/reset")
public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
String email = payload.get("email").trim().toLowerCase();
String newPassword = payload.get("newPassword").trim();

Optional<User> userOpt = userRepo.findByEmail(email);
if (userOpt.isPresent()) {
User user = userOpt.get();
user.setPassword(newPassword); // 🔐 In production, hash the password!
userRepo.save(user);
return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
}

return ResponseEntity.status(HttpStatus.NOT_FOUND)
.body(Map.of("message", "Email not found"));
}

}
