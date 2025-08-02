package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Event;
import com.example.repository.EventRepository;

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

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public List<Event> findByUserId(Long userId) {
        return eventRepository.findByUser_Id(userId);
    }
<<<<<<< HEAD
=======
    
>>>>>>> vendor

}
