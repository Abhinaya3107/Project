//package com.example.controllers;
//import java.io.IOException;
//import java.security.Principal;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.example.dto.LoginRequest;
//import com.example.model.Organizer;
//import com.example.model.User;
//import com.example.model.Vendor;
//import com.example.service.OrganizerService;
//
//@RestController
//@RequestMapping("/api/organizers")
//@CrossOrigin(origins = "*") // Allow React frontend to access this
//public class OrganizerController {
//
//    @Autowired
//    private OrganizerService organizerService;
//
//    
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
//        System.out.println("Email: [" + request.getEmail() + "]");
//        System.out.println("Password: [" + request.getPassword() + "]");
//
//        Optional<Organizer> organizerOpt = organizerService.findByEmail(request.getEmail().trim().toLowerCase());
//
//        if (organizerOpt.isPresent()) {
//            Organizer organizer = organizerOpt.get();
//            System.out.println("DB Password: [" + organizer.getPassword() + "]");
//
//            if (organizer.getPassword().trim().equals(request.getPassword().trim())) {
//                return ResponseEntity.ok(Map.of(
//                    "message", "Login successful!",
//                    "organizer", organizer  // ✅ Return full organizer object
//                ));
//            }
//        }
//
//        return ResponseEntity
//            .status(HttpStatus.UNAUTHORIZED)
//            .body(Map.of("message", "Invalid email or password"));
//    }
//
//
//    
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody Organizer organizer) {
//        try {
//            Organizer saved = organizerService.registerOrganizer(organizer);
//            return ResponseEntity.ok(saved);
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//    @GetMapping
//    public List<Organizer> getAllOrganizers() {
//        return organizerService.findAll();
//    } 
//   
////Update password in settings
//
//    @PutMapping("/{id}/change-password")
//    public ResponseEntity<String> changeOrganizerPassword(
//            @PathVariable Long id,
//            @RequestBody Map<String, String> request) {
//
//        Optional<Organizer> optionalOrganizer = organizerService.findById(id);
//        if (optionalOrganizer.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organizer not found");
//        }
//
//        Organizer organizer = optionalOrganizer.get();
//
//        // Get current and new passwords from the request
//        String currentPassword = request.get("currentPassword");
//        String newPassword = request.get("newPassword");
//
//        // Check if current password matches
//        if (currentPassword == null || !organizer.getPassword().equals(currentPassword)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
//        }
//
//        // Validate new password
//        if (newPassword == null || newPassword.trim().isEmpty()) {
//            return ResponseEntity.badRequest().body("New password must not be null or empty");
//        }
//
//        newPassword = newPassword.trim();
//        if (newPassword.length() < 6 || newPassword.length() > 8) {
//            return ResponseEntity.badRequest().body("Password must be between 6 to 8 characters");
//        }
//
//        // Save updated password
//        organizer.setPassword(newPassword);
//        organizerService.save(organizer);
//
//        return ResponseEntity.ok("Password updated successfully");
//    }
//
//
//
//    
//
//    
//    @GetMapping("/profile/{id}")
//    public ResponseEntity<?> getVendorProfile(@PathVariable Long id) {
//        Optional<Organizer> organizerOpt = organizerService.getOrganizerById(id);
//
//        if (organizerOpt.isPresent()) {
//            return ResponseEntity.ok(organizerOpt.get());
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organizer not found");
//        }
//    }
//    //Update Profile
//    @PutMapping("/profile/{id}")
//    public ResponseEntity<?> updateOrganizerProfile(
//            @PathVariable Long id,
//            @RequestParam("firstName") String firstName,
//            @RequestParam("lastName") String lastName,
//            @RequestParam("mobile") String mobile,
//            @RequestParam("address") String address,
//            @RequestParam("organizationName") String organizationName,
//            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
//        
//        try {
//            // You’ll need to modify your service to accept these parameters
//            organizerService.updateOrganizer(id, firstName, lastName, mobile, address, organizationName, profileImage);
//            return ResponseEntity.ok("Profile updated successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organizer not found");
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process image");
//    }
//}
//}




package com.example.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.dto.LoginRequest;
import com.example.model.Organizer;
import com.example.service.OrganizerService;

@RestController
@RequestMapping("/api/organizers")
@CrossOrigin(origins = "*") // Allow React frontend to access this
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Organizer> organizerOpt = organizerService.findByEmail(request.getEmail().trim().toLowerCase());

        if (organizerOpt.isPresent()) {
            Organizer organizer = organizerOpt.get();
            if (organizer.getPassword().trim().equals(request.getPassword().trim())) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful!",
                    "organizer", organizer
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("message", "Invalid email or password"));
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Organizer organizer) {
        try {
            Organizer saved = organizerService.registerOrganizer(organizer);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ GET ALL ORGANIZERS
    @GetMapping
    public ResponseEntity<List<Organizer>> getAllOrganizers() {
        return ResponseEntity.ok(organizerService.findAll());
    }

    // ✅ CHANGE PASSWORD (Settings)
    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changeOrganizerPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        Optional<Organizer> optionalOrganizer = organizerService.findById(id);
        if (optionalOrganizer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Organizer not found"));
        }

        Organizer organizer = optionalOrganizer.get();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentPassword == null || !organizer.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Current password is incorrect"));
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password must not be null or empty"));
        }

        newPassword = newPassword.trim();
        if (newPassword.length() < 6 || newPassword.length() > 8) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be between 6 to 8 characters"));
        }

        organizer.setPassword(newPassword);
        organizerService.save(organizer);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    // ✅ GET PROFILE
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getVendorProfile(@PathVariable Long id) {
        Optional<Organizer> organizerOpt = organizerService.getOrganizerById(id);
        return organizerOpt.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Organizer not found")));
    }

    // ✅ UPDATE PROFILE
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateOrganizerProfile(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("mobile") String mobile,
            @RequestParam("address") String address,
            @RequestParam("organizationName") String organizationName,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            organizerService.updateOrganizer(id, firstName, lastName, mobile, address, organizationName, profileImage);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Organizer not found"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to process image"));
        }
    }

    // ✅ FORGOT PASSWORD: Check if email exists
    @PostMapping("/forgot-password/check")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email").trim().toLowerCase();
        Optional<Organizer> organizerOpt = organizerService.findByEmail(email);

        return ResponseEntity.ok(Map.of("exists", organizerOpt.isPresent()));
    }

    // ✅ FORGOT PASSWORD: Reset password
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email").trim().toLowerCase();
        String newPassword = payload.get("newPassword").trim();

        Optional<Organizer> organizerOpt = organizerService.findByEmail(email);
        if (organizerOpt.isPresent()) {
            Organizer organizer = organizerOpt.get();
            organizer.setPassword(newPassword); // 🔐 Consider hashing in production
            organizerService.save(organizer);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("message", "Email not found"));
    }
}