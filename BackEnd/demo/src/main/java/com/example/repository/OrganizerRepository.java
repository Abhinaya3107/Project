package com.example.repository;

import com.example.model.Organizer;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
    Optional<Organizer> findByEmail(String email);
    Optional<Organizer> findById(Long id); 

 
    


}



