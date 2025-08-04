package com.example.controllers;

import com.example.dto.EventSummaryDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.model.User;
import com.example.model.Vendor;
import com.example.repository.EventRepository;
import com.example.repository.UserRepository;
import com.example.service.EventService;

import java.time.LocalDate;
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
    private EventService eventService;

    @Autowired
    private UserRepository userRepo;

    // Create Event and associate with user
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        event.setUser(user);

        if (event.getVendors() != null) {
            for (Vendor vendor : event.getVendors()) {
                vendor.setEvent(event);
            }
        }

        Event savedEvent = eventService.save(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    
    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        return eventService.findById(eventId).map(existingEvent -> {
            existingEvent.setEventName(updatedEvent.getEventName());
            existingEvent.setDateTime(updatedEvent.getDateTime());
            existingEvent.setCapacity(updatedEvent.getCapacity());
            existingEvent.setBudget(updatedEvent.getBudget());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setVenue(updatedEvent.getVenue());
            Event saved = eventService.save(existingEvent);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
 // Delete an event by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        if (!eventService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with ID: " + id);
        }
        eventService.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully");
    }


    // Get all events (for admin or public use)
    @GetMapping
    public List<Event> getAllEvents() {
    	 return eventService.getAllEvents();
    }

    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable Long userId) {
        return eventService.findByUserId(userId);
    }

    @GetMapping("/events/count")
    public ResponseEntity<Long> getEventCount() {
        long count = eventService.countEvents(); // assume this method calls eventRepository.count()
        return ResponseEntity.ok(count);
    }
    //Select all
    @GetMapping("/summary")
    public List<EventSummaryDTO> getEventSummaries() {
        return eventService.getEventSummaries();
    }
    //Accept or reject event
 
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam EventStatus status) {
        Optional<Event> optionalEvent = eventService.findById(id);
        if (optionalEvent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Event event = optionalEvent.get();
        event.setStatus(status);
        eventService.save(event);
        return ResponseEntity.ok("Event status updated to " + status);
    }

    


   

    
}
