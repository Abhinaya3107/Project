package com.example.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.EventSummaryDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.repository.EventRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event save(Event event) {
        return eventRepository.save(event);
    }

    public Optional<Event> findById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public boolean existsById(Long id) {
        return eventRepository.existsById(id);
    }

    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> findByUserId(Long userId) {
        return eventRepository.findByUser_Id(userId);
    }

    public long countEvents() {
        return eventRepository.count();
    }

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
    

}
