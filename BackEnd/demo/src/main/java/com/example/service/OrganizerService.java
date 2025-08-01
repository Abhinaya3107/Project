package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Organizer;
import com.example.repository.OrganizerRepository;

@Service
public class OrganizerService {

    @Autowired
    private OrganizerRepository orgRepo;

    public List<Organizer> findAll() {
        return orgRepo.findAll();
    }

    public List<Organizer> findByCategory(String category) {
        return orgRepo.findByCategory(category);
    }
}
