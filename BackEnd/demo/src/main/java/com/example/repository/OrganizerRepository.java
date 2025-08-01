package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Organizer;

public interface OrganizerRepository extends JpaRepository<Organizer,Long>{
	List<Organizer> findByCategory(String category);
}
