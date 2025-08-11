

package com.example.controllers;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.dto.LoginRequest;
import com.example.dto.OrganizerSignupDTO;
import com.example.model.Organizer;
import com.example.service.OrganizerService;

import jakarta.validation.Valid;

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
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody OrganizerSignupDTO dto) {
        try {
            // ✅ Restrict category to only Photography or Caterer
            if (!dto.getCategory().equalsIgnoreCase("Wedding") &&
                !dto.getCategory().equalsIgnoreCase("Party") &&
                !dto.getCategory().equalsIgnoreCase("Corporate")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Category must be either Photography or Caterer"));
            }

            // ✅ Check if email exists
            if (organizerService.existsByEmail(dto.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
            }

            // ✅ Check if mobile exists
            if (organizerService.existsByMobileNumber(dto.getMobileNumber())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mobile number already registered"));
            }

            // ✅ Map DTO to Entity
            Organizer organizer = Organizer.builder()
            	    .firstName(dto.getFirstName())
            	    .lastName(dto.getLastName())
            	    .email(dto.getEmail())
            	    .mobileNumber(dto.getMobileNumber())
            	    .address(dto.getAddress())
            	    .organizationName(dto.getOrganizationName())
            	    .category(dto.getCategory())  // ✅ Added this
            	    .password(dto.getPassword())
            	    .build();


            Organizer saved = organizerService.registerOrganizer(organizer);

            return ResponseEntity.ok(Map.of(
                    "message", "Organizer registered successfully",
                    "id", saved.getId()
            ));
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Organizer not found"));
        }

        Organizer organizer = optionalOrganizer.get();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentPassword == null || !organizer.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Current password is incorrect"));
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "New password must not be null or empty"));
        }

        newPassword = newPassword.trim();

        // ✅ New password validation: length + complexity
        if (newPassword.length() < 6 || newPassword.length() > 20) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must be between 6 to 20 characters"));
        }

        // Regex for at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$";
        if (!newPassword.matches(passwordPattern)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must contain uppercase, lowercase, digit, and special character"));
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