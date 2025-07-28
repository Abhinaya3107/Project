package com.example.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
}
