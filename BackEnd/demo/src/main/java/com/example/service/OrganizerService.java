package com.example.service;

import com.example.model.Organizer;
import com.example.repository.OrganizerRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OrganizerService {

    @Autowired
    private OrganizerRepository organizerRepository;

    // ✅ Register new organizer
    public Organizer registerOrganizer(Organizer organizer) {
        if (organizerRepository.existsByEmail(organizer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (organizerRepository.existsByMobileNumber(organizer.getMobileNumber())) {
            throw new RuntimeException("Mobile number already registered");
        }

        return organizerRepository.save(organizer);
    }
    public boolean existsByEmail(String email) {
        return organizerRepository.existsByEmail(email);
    }

    public boolean existsByMobileNumber(String mobileNumber) {
        return organizerRepository.existsByMobileNumber(mobileNumber);
    }


    // ✅ Get all organizers
    public List<Organizer> findAll() {
        return organizerRepository.findAll();
    }

    // ✅ Find by email
    public Optional<Organizer> findByEmail(String email) {
        return organizerRepository.findByEmail(email);
    }

    // ✅ Find by ID
    public Optional<Organizer> findById(Long id) {
        return organizerRepository.findById(id);
    }

    // ✅ Save organizer (generic)
    public void save(Organizer organizer) {
        organizerRepository.save(organizer);
    }

    // ✅ Get organizer by ID (used in profile)
    public Optional<Organizer> getOrganizerById(Long id) {
        return organizerRepository.findById(id);
    }

    // ✅ Update profile
    public void updateOrganizer(Long id, String firstName, String lastName, String mobileNumber,
                                String address, String organizationName, MultipartFile profileImage) throws IOException {

        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        organizer.setFirstName(firstName);
        organizer.setLastName(lastName);
        organizer.setMobileNumber(mobileNumber);
        organizer.setAddress(address);
        organizer.setOrganizationName(organizationName);
//        organizer.setPassword(password);

        if (profileImage != null && !profileImage.isEmpty()) {
            organizer.setProfileImage(profileImage.getBytes()); // Save as byte[]
        }

        organizerRepository.save(organizer);
    }

    // ✅ Reset password (optional helper method)
    public boolean resetPassword(String email, String newPassword) {
        Optional<Organizer> organizerOpt = organizerRepository.findByEmail(email);
        if (organizerOpt.isPresent()) {
            Organizer organizer = organizerOpt.get();
            organizer.setPassword(newPassword); // 🔐 Consider hashing in production
            organizerRepository.save(organizer);
            return true;
        }
        return false;
    }
}
