package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Event;

public interface EventRepository extends JpaRepository<Event, Long>{
	List<Event> findByUserId(Long userId);
}
