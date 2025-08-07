package com.example.controllers;

import com.example.dto.EventSummaryDTO;
import com.example.dto.UpcomingEventDTO;
import com.example.dto.VendoDTO1;
import com.example.dto.VendorUpdateDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.model.Organizer;
import com.example.model.User;
import com.example.model.Vendor;
import com.example.repository.UserRepository;
import com.example.service.EventService;
import com.example.service.OrganizerService;
import com.example.service.VendorService;
import jakarta.transaction.Transactional;
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
    
    @Autowired
    private OrganizerService orgService;

 // ✅ CREATE EVENT
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        event.setUser(user);

        // Associate vendors by email
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


    // ✅ 2. UPDATE EVENT (using Vendor Emails)
    @PutMapping("/update")
    public Event updateEvent(@RequestParam Long eventId, @RequestBody VendorUpdateDTO updatedEvent) {
        Event existingEvent = eventService.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existingEvent.setEventName(updatedEvent.getEventName());
        existingEvent.setDateTime(updatedEvent.getDateTime());
        existingEvent.setVenue(updatedEvent.getVenue());
        existingEvent.setStatus(updatedEvent.getStatus());
        existingEvent.setCapacity(updatedEvent.getCapacity());

        // Detach old vendors
        for (Vendor oldVendor : existingEvent.getVendors()) {
            oldVendor.getEvents().remove(existingEvent);
        }
        existingEvent.getVendors().clear();

        // Attach new vendors
        List<Vendor> updatedVendors = new ArrayList<>();
        for (VendoDTO1 vendorDTO : updatedEvent.getVendors()) {
            Vendor vendor = vendorService.findByEmail(vendorDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("Vendor not found: " + vendorDTO.getEmail()));

            vendor.setStatus("booked");
            vendor.getEvents().add(existingEvent); // bidirectional
            updatedVendors.add(vendor);
        }

        existingEvent.setVendors(updatedVendors);
        return eventService.save(existingEvent);
    }

    // ✅ 3. BASIC EVENT UPDATE (without vendors)
    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEventBasic(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        return eventService.findById(eventId).map(existingEvent -> {
            existingEvent.setEventName(updatedEvent.getEventName());
            existingEvent.setDateTime(updatedEvent.getDateTime());
            existingEvent.setCapacity(updatedEvent.getCapacity());
            existingEvent.setBudget(updatedEvent.getBudget());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setVenue(updatedEvent.getVenue());
            return ResponseEntity.ok(eventService.save(existingEvent));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ 4. DELETE EVENT
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        if (!eventService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with ID: " + id);
        }
        eventService.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // ✅ 5. GET ALL EVENTS
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // ✅ 6. GET EVENTS BY USER ID
    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable Long userId) {
        return eventService.findByUserId(userId);
    }

    // ✅ 7. GET EVENT COUNT
    @GetMapping("/events/count")
    public ResponseEntity<Long> getEventCount() {
        return ResponseEntity.ok(eventService.countEvents());
    }

    // ✅ 8. GET EVENT SUMMARY
    @GetMapping("/summary")
    public List<EventSummaryDTO> getEventSummaries() {
        return eventService.getEventSummaries();
    }

    // ✅ 9. UPDATE STATUS
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

    // ✅ 10. GET UPCOMING APPROVED EVENTS (for dashboard)
    @GetMapping("/upcoming")
    public ResponseEntity<List<UpcomingEventDTO>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingApprovedEvents());
    }
    
    //Map organizer id to event
    @PutMapping("/{id}/updatestatus")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam Long organizerId) {

        Optional<Event> optionalEvent = eventService.findById(id);
        if (optionalEvent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Organizer> optionalOrganizer = orgService.findById(organizerId);
        if (optionalOrganizer.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid organizer ID");
        }

        Event event = optionalEvent.get();
        event.setStatus(EventStatus.valueOf(status.toUpperCase()));
        event.setOrganizer(optionalOrganizer.get());

        eventService.save(event);

        return ResponseEntity.ok("Status and organizer updated successfully");
    }

}
