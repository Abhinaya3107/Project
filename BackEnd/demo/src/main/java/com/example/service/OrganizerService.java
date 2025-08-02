package com.example.service;

import com.example.model.Organizer;
import com.example.repository.OrganizerRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizerService {

    @Autowired
    private OrganizerRepository organizerRepository;

    public Organizer registerOrganizer(Organizer organizer) {
        if (organizerRepository.existsByEmail(organizer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (organizerRepository.existsByMobileNumber(organizer.getMobileNumber())) {
            throw new RuntimeException("Mobile number already registered");
        }

        return organizerRepository.save(organizer);
    }

    public List<Organizer> findAll() {
        return organizerRepository.findAll();
    }

}

