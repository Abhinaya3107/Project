package com.example.controllers;

import com.example.model.Organizer;
import com.example.service.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizers")
@CrossOrigin(origins = "*") // Allow React frontend to access this
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Organizer organizer) {
        try {
            Organizer saved = organizerService.registerOrganizer(organizer);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
