package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Venue;
import com.example.repository.VenueRepository;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepo;

    public List<Venue> getAllVenues() {
        return venueRepo.findAll();
    }
}

