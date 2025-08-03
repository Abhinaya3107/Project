package com.example.controllers;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.dto.LoginRequest;
import com.example.model.Organizer;
import com.example.model.Vendor;
import com.example.service.OrganizerService;

@RestController
@RequestMapping("/api/organizers")
@CrossOrigin(origins = "*") // Allow React frontend to access this
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Email: [" + request.getEmail() + "]");
        System.out.println("Password: [" + request.getPassword() + "]");

        Optional<Organizer> organizerOpt = organizerService.findByEmail(request.getEmail().trim().toLowerCase());

        if (organizerOpt.isPresent()) {
            Organizer organizer = organizerOpt.get();
            System.out.println("DB Password: [" + organizer.getPassword() + "]");

            if (organizer.getPassword().trim().equals(request.getPassword().trim())) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful!",
                    "organizerId", organizer.getId()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
    }

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Organizer organizer) {
        try {
            Organizer saved = organizerService.registerOrganizer(organizer);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping
    public List<Organizer> getAllOrganizers() {
        return organizerService.findAll();
    }
    
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getVendorProfile(@PathVariable Long id) {
        Optional<Organizer> organizerOpt = organizerService.getOrganizerById(id);

        if (organizerOpt.isPresent()) {
            return ResponseEntity.ok(organizerOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organizer not found");
        }
    }
    //Update Profile
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
            // You’ll need to modify your service to accept these parameters
            organizerService.updateOrganizer(id, firstName, lastName, mobile, address, organizationName, profileImage);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organizer not found");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process image");
        }
    }
}
