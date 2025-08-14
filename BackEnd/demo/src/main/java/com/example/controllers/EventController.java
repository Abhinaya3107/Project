package com.example.controllers;

import com.example.dto.CreateEventDTO;
import com.example.dto.EventSummaryDTO;
import com.example.dto.UpcomingEventDTO;
import com.example.dto.UpcomingEventDTO.VendorIdDTO;
import com.example.dto.VendoDTO1;
import com.example.dto.VendorUpdateDTO;
import com.example.enums.EventStatus;
import com.example.model.Event;
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

 // CREATE EVENT with userId association
    @PostMapping("/create-event")
    public ResponseEntity<Event> createEvent(@RequestBody CreateEventDTO dto, @RequestParam Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = new Event();
        event.setEventName(dto.getEventName());
        event.setDateTime(dto.getDateTime());
        event.setCapacity(dto.getCapacity());
        event.setBudget(dto.getBudget());
        event.setDescription(dto.getDescription());
        event.setVenue(dto.getVenue());
        event.setStatus(dto.getStatus());
        event.setUser(user); 

        return ResponseEntity.ok(eventService.save(event));
    }


    //  2. UPDATE EVENT (using Vendor Emails)
    @PutMapping("/assign-vendors/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody UpcomingEventDTO request) {
        Optional<Event> existingEventOpt = eventService.findById(id);
        if (!existingEventOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Event existingEvent = existingEventOpt.get();

        
        existingEvent.setEventName(request.getEventName());
        existingEvent.setVenue(request.getVenue());
        existingEvent.setDateTime(request.getDateTime());
        existingEvent.setCapacity(request.getCapacity());
        existingEvent.setBudget(request.getBudget());

       
        try {
            existingEvent.setStatus(EventStatus.valueOf(request.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Invalid status string
        }

       
        List<Vendor> vendorList = new ArrayList<>();
        if (request.getVendors() != null) {
            for (UpcomingEventDTO.VendorIdDTO vendorDTO : request.getVendors()) {
                vendorService.findById(vendorDTO.getVid()).ifPresent(vendorList::add);
            }
        }
        existingEvent.setVendors(vendorList);

        
        Event savedEvent = eventService.save(existingEvent);
        return ResponseEntity.ok(savedEvent);
    }

    //Basic event update
    @PutMapping("/update-event/{eventId}")
    public ResponseEntity<Event> updateEventBasic(
            @PathVariable Long eventId,
            @RequestBody CreateEventDTO dto) {

        return eventService.findById(eventId).map(existingEvent -> {
            existingEvent.setEventName(dto.getEventName());
            existingEvent.setDateTime(dto.getDateTime());
            existingEvent.setVenue(dto.getVenue());
            existingEvent.setBudget(dto.getBudget());
            existingEvent.setCapacity(dto.getCapacity());
            existingEvent.setDescription(dto.getDescription());

            Event updatedEvent = eventService.save(existingEvent);
            return ResponseEntity.ok(updatedEvent);
        }).orElse(ResponseEntity.notFound().build());
    }


    //DELETE EVENT by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        if (!eventService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with ID: " + id);
        }
        eventService.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // GET ALL EVENTS without id
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    //GET EVENTS BY USER ID
    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable Long userId) {
        return eventService.findByUserId(userId);
    }

    //  GET EVENT COUNT
    @GetMapping("/events/count")
    public ResponseEntity<Long> getEventCount() {
        return ResponseEntity.ok(eventService.countEvents());
    }

    // GET EVENT SUMMARY
    @GetMapping("/summary")
    public List<EventSummaryDTO> getEventSummaries() {
        return eventService.getEventSummaries();
    }

    // UPDATE STATUS of event
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

    // GET UPCOMING APPROVED EVENTS (for dashboard)
    @GetMapping("/upcoming")
    public ResponseEntity<List<UpcomingEventDTO>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingApprovedEvents());
    }
    
    // GET UPCOMING APPROVED EVENTS WITH VENDOR DETAILS (for organizer dashboard)
    @GetMapping("/upcoming-with-vendors")
    public ResponseEntity<List<Event>> getUpcomingEventsWithVendors() {
        return ResponseEntity.ok(eventService.getUpcomingApprovedEventsWithVendors());
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
