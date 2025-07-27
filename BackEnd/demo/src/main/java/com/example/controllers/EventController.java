package com.example.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.model.Event;
import com.example.repository.EventRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins="*")//allow all 
public class EventController {
	@Autowired
	private EventRepository eventRepo;
	
	@PostMapping
	public Event createEvent(@RequestBody Event event) 
	{
		return eventRepo.save(event);
	}
	public List<Event> getAllEvents()
	{
		return eventRepo.findAll();
	}
}