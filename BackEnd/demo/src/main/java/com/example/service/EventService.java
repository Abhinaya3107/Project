package com.example.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.EventSummaryDTO;
import com.example.dto.UpcomingEventDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Save or update event
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    // Find event by ID
    public Optional<Event> findById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    // Check existence by ID
    public boolean existsById(Long id) {
        return eventRepository.existsById(id);
    }

    // Delete by ID
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get events by user ID
    public List<Event> findByUserId(Long userId) {
        return eventRepository.findByUser_Id(userId);
    }

    // Count total events
    public long countEvents() {
        return eventRepository.count();
    }

    // Get list of event summaries
    public List<EventSummaryDTO> getEventSummaries() {
        List<Event> events = eventRepository.findAll();

        return events.stream().map(event -> {
            String username = event.getUser() != null
                    ? event.getUser().getFirstName() + " " + event.getUser().getLastName()
                    : "Unknown";

            return new EventSummaryDTO(
                    event.getId(),
                    username,
                    event.getEventName(),
                    event.getDateTime(),
                    event.getVenue(),
                    event.getBudget()
            );
        }).collect(Collectors.toList());
    }

    // Get list of upcoming approved events
    public List<UpcomingEventDTO> getUpcomingApprovedEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now(), EventStatus.APPROVED);
    }
}
