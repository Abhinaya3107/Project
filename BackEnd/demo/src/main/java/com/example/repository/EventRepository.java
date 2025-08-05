package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Event;
import com.example.model.EventStatus;

public interface EventRepository extends JpaRepository<Event, Long> {

  
	List<Event> findByUser_Id(Long userId);
	
	// EventRepository.java
	List<Event> findByStatus(EventStatus status);

	
	

}
