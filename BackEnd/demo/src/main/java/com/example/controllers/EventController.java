package com.example.controllers;

import com.example.dto.EventSummaryDTO;
import com.example.dto.EventSummaryDTOofapprove;
import com.example.dto.UpcomingEventDTO;
import com.example.dto.VendoDTO1;
import com.example.dto.VendorUpdateDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.model.User;
import com.example.model.Vendor;
import com.example.repository.EventRepository;
import com.example.repository.UserRepository;
import com.example.service.EventService;
import com.example.service.VendorService;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    private VendorService vendorService;

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
            List<Vendor> attachedVendors = new ArrayList<>();
            for (Vendor vendor : event.getVendors()) {
                Vendor existingVendor = vendorService.findByEmail(vendor.getEmail())
                    .orElseThrow(() -> new RuntimeException("Vendor not found: " + vendor.getEmail()));

                existingVendor.setStatus("booked");
                existingVendor.setEvent(event);
                attachedVendors.add(existingVendor);
            }
            event.setVendors(attachedVendors);

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
    @GetMapping("/events")
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


    @Transactional
    @PutMapping("/update")
    public Event updateEvent(@RequestParam Long eventId, @RequestBody VendorUpdateDTO updatedEvent) {
       Event existingEvent = eventService.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        // Update event properties
        existingEvent.setEventName(updatedEvent.getEventName());
        existingEvent.setDateTime(updatedEvent.getDateTime());
        existingEvent.setVenue(updatedEvent.getVenue());
        existingEvent.setStatus(updatedEvent.getStatus());
        existingEvent.setCapacity(updatedEvent.getCapacity());

       // Detach previous vendors (modify in-place)
        List<Vendor> currentVendors = existingEvent.getVendors();
        currentVendors.clear();

       // Attach new vendors (no duplicates)
        Set<Long> seenVendorIds = new HashSet<>();
        for (VendoDTO1 vendorInput : updatedEvent.getVendors()) {
            if (seenVendorIds.add(vendorInput.getVendorId())) {
                Vendor existingVendor = vendorService.findById(vendorInput.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found: " + vendorInput.getVendorId()));

                existingVendor.setStatus("booked");
               existingVendor.setEvent(existingEvent);
                currentVendors.add(existingVendor);
            }
       }

        return eventService.save(existingEvent);
    }
    
 // ✅ NEW: Filter events by status (used in dashboard links)
    @GetMapping
    public ResponseEntity<List<Event>> getEventsByStatus(@RequestParam(required = false) String status) {
        List<Event> events;

        if (status != null && !status.isBlank()) {
            events = eventService.findByStatus(status.trim());
        } else {
            events = eventService.getAllEvents();
        }

        return ResponseEntity.ok(events);
    }
 
    
   
    @GetMapping("/upcoming")
    public ResponseEntity<List<UpcomingEventDTO>> getUpcomingEvent() {
        List<UpcomingEventDTO> upcomingEvents = eventService.getUpcomingEvents();
        return ResponseEntity.ok(upcomingEvents);
    }

}
