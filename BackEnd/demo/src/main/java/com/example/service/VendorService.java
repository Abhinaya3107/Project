package com.example.service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Vendor;

public interface VendorService extends JpaRepository<Vendor, Long>{

}
