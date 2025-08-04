package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Venue;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}
