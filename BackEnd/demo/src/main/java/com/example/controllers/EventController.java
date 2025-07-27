package com.example.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.model.Event;
import com.example.repository.EventRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins="*")
public class EventController {

    @Autowired
    private EventRepository eventRepo;

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        System.out.println("Received Event: " + event);
        Event savedEvent = eventRepo.save(event);
        System.out.println("Received JSON: " + event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }
}
