package com.example.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Venue;
import com.example.repository.VenueRepository;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
	@Autowired
	private VenueRepository venueRepo;
	
	public List<Venue> getAllVenues(){
		return venueRepo.findAll();
	}
}
