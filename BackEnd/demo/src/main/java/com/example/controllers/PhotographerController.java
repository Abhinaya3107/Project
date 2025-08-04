package com.example.controllers;

import com.example.model.Photography;
import com.example.repository.PhotographerRepository;
import com.example.service.PhotographerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photographers")
@CrossOrigin(origins = "*")
public class PhotographerController {

    @Autowired
    private PhotographerService photographerService;

    @GetMapping
    public List<Photography> getAllPhotographers() {
        return photographerService.getAllPhotographers();
    }
}
