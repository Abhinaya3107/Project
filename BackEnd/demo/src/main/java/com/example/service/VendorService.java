package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Vendor;
import com.example.repository.VendorRepository;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    public Optional<Vendor> authenticate(String email, String password) {
        return vendorRepository.findByEmailAndPassword(email, password);
    }

    public String registerVendor(Vendor vendor) {
        if (vendorRepository.existsByEmail(vendor.getEmail())) {
            return "Vendor already exists";
        }
        vendorRepository.save(vendor);
        return "Vendor registered successfully!";
    }

    public List<Vendor> findByCategory(String category) {
        return vendorRepository.findByCategory(category);
    }

    public List<Vendor> findByEventId(Long eventId) {
        return vendorRepository.findByEventId(eventId);
    }
}
