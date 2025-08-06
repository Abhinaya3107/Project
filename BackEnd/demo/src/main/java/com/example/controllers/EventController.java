package com.example.controllers;

import com.example.dto.EventSummaryDTO;
import com.example.dto.UpcomingEventDTO;
import com.example.dto.VendoDTO1;
import com.example.dto.VendorUpdateDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.model.User;
import com.example.model.Vendor;
import com.example.repository.UserRepository;
import com.example.service.EventService;
import com.example.service.VendorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    // ✅ CREATE EVENT
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        event.setUser(user);

        // ✅ Associate vendors bidirectionally using EMAIL
        if (event.getVendors() != null) {
            List<Vendor> attachedVendors = new ArrayList<>();
            for (Vendor vendor : event.getVendors()) {
                Vendor existingVendor = vendorService.findByEmail(vendor.getEmail())
                        .orElseThrow(() -> new RuntimeException("Vendor not found: " + vendor.getEmail()));
                existingVendor.setStatus("booked");

                existingVendor.getEvents().add(event); // Bidirectional
                attachedVendors.add(existingVendor);
            }
            event.setVendors(attachedVendors);
        }

        Event savedEvent = eventService.save(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    // ✅ UPDATE EVENT WITH VENDOR CHANGES using EMAIL
    @PutMapping("/update")
    public Event updateEvent(@RequestParam Long eventId, @RequestBody VendorUpdateDTO updatedEvent) {
        Event existingEvent = eventService.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existingEvent.setEventName(updatedEvent.getEventName());
        existingEvent.setDateTime(updatedEvent.getDateTime());
        existingEvent.setVenue(updatedEvent.getVenue());
        existingEvent.setStatus(updatedEvent.getStatus());
        existingEvent.setCapacity(updatedEvent.getCapacity());

        // Clear old vendors
        for (Vendor oldVendor : existingEvent.getVendors()) {
            oldVendor.getEvents().remove(existingEvent);
        }
        existingEvent.getVendors().clear();

        // Attach new vendors using EMAIL
        List<Vendor> updatedVendors = new ArrayList<>();
        for (VendoDTO1 vendorDTO : updatedEvent.getVendors()) {
            Vendor vendor = vendorService.findByEmail(vendorDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("Vendor not found: " + vendorDTO.getEmail()));

            vendor.setStatus("booked");
            vendor.getEvents().add(existingEvent); // Bidirectional
            updatedVendors.add(vendor);
        }

        existingEvent.setVendors(updatedVendors);
        return eventService.save(existingEvent);
    }

    // BASIC UPDATE
    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEventBasic(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
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

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        if (!eventService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with ID: " + id);
        }
        eventService.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // FETCH ALL
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // FETCH BY USER
    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable Long userId) {
        return eventService.findByUserId(userId);
    }

    // COUNT
    @GetMapping("/events/count")
    public ResponseEntity<Long> getEventCount() {
        return ResponseEntity.ok(eventService.countEvents());
    }

    // SUMMARY
    @GetMapping("/summary")
    public List<EventSummaryDTO> getEventSummaries() {
        return eventService.getEventSummaries();
    }

    // STATUS UPDATE
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

    // UPCOMING EVENTS
    @GetMapping("/upcoming")
    public ResponseEntity<List<UpcomingEventDTO>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingApprovedEvents());
    }
}
