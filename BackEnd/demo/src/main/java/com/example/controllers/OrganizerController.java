package com.example.controllers;

import com.example.model.Organizer;
import com.example.service.OrganizerService;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/organizers")
@CrossOrigin(origins = "*") // Allow React frontend to access this
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    // ✅ Register organizer
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Organizer organizer) {
        try {
            Organizer saved = organizerService.registerOrganizer(organizer);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔄 Update organizer profile (with image upload)
    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateOrganizer(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("address") String address,
            @RequestParam("organizationName") String organizationName,
            @RequestParam("password") String password,
         
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            Organizer updated = organizerService.updateOrganizerProfile(
                id, firstName, lastName, email, mobileNumber, address,
                organizationName, password, null, profileImage
            );
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getOrganizerProfile(@PathVariable Long id) {
        try {
            Organizer organizer = organizerService.getOrganizerById(id);
            return ResponseEntity.ok(organizer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        }
    }

}
