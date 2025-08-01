package com.example.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Organizer;

public interface OrganizerService extends JpaRepository<Organizer,Long>{
	List<Organizer> findByCategory(String category);
}
