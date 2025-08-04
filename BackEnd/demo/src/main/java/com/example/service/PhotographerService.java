package com.example.service;

import com.example.model.Photography;
import com.example.repository.PhotographerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotographerService {

    @Autowired
    private PhotographerRepository photographerRepository;

    public List<Photography> getAllPhotographers() {
        return photographerRepository.findAll();
    }
}
