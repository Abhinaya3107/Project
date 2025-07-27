package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long>{

}
