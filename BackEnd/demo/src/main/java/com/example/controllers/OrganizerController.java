package com.example.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Organizer;
import com.example.repository.OrganizerRepository;

@RestController
@RequestMapping("/api/organizers")
public class OrganizerController {
	@Autowired
	private OrganizerRepository orgRepo;
	
	@GetMapping
	public List<Organizer> getAllOrganizers()
	{
		return orgRepo.findAll();
	}
	
	@GetMapping("/category/{category}")
    public List<Organizer> getByCategory(@PathVariable String category) {
        if (category.equalsIgnoreCase("All")) {
            return orgRepo.findAll();
        }
        return orgRepo.findByCategory(category);
    }
}
