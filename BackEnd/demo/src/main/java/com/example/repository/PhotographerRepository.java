package com.example.repository;

import com.example.model.Photography;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotographerRepository extends JpaRepository<Photography, Long> {
    // No extra methods needed for basic fetch
}
