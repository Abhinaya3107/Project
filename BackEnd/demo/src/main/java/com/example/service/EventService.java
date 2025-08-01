package com.example.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Event;

public interface EventService extends JpaRepository<Event, Long>{
	List<Event> findByUserId(Long userId);
}
