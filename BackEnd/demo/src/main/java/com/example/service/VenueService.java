package com.example.service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Venue;

public interface VenueService extends JpaRepository<Venue, Long>{
	
}
