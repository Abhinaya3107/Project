package com.example.controllers;

import com.example.model.Event;
import com.example.model.User;
import com.example.service.EventService;

import com.example.service.UserService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventRepo;

    @Autowired
    private UserService userRepo;

    // Create Event and associate with user
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        event.setUser(user); // Associate event with user

        System.out.println("Received Event: " + event);
        Event savedEvent = eventRepo.save(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }
    
    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        return eventRepo.findById(eventId).map(existingEvent -> {
            existingEvent.setEventName(updatedEvent.getEventName());
            existingEvent.setDateTime(updatedEvent.getDateTime());
            existingEvent.setCapacity(updatedEvent.getCapacity());
            existingEvent.setBudget(updatedEvent.getBudget());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setVenue(updatedEvent.getVenue());
            Event saved = eventRepo.save(existingEvent);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
 // Delete an event by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        if (!eventRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with ID: " + id);
        }
        eventRepo.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully");
    }


    // Get all events (for admin or public use)
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    // Get events for a specific user
    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable Long userId) {
        return eventRepo.findByUserId(userId);
    }
}
