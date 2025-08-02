package com.example.service;

import com.example.model.Organizer;
import com.example.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@Service
public class OrganizerService {

    @Autowired
    private OrganizerRepository organizerRepository;

    // ✅ Register organizer
    public Organizer registerOrganizer(Organizer organizer) {
        // You can add password hashing or email uniqueness check here if needed
        return organizerRepository.save(organizer);
    }

    // 🔄 Update organizer profile
    public Organizer updateOrganizerProfile(Long id,
            String firstName, String lastName, String email,
            String mobileNumber, String address, String organizationName,
            String password, LocalDate dateOfJoining,
            MultipartFile profileImage) {

        Organizer existing = organizerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Organizer not found"));

        existing.setFirstName(firstName);
        existing.setLastName(lastName);
        existing.setEmail(email);
        existing.setMobileNumber(mobileNumber);
        existing.setAddress(address);
        existing.setOrganizationName(organizationName);
        existing.setPassword(password); // 🛡️ Consider encoding
   

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                existing.setProfileImage(profileImage.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image");
            }
        }

        return organizerRepository.save(existing);
    }
    public Organizer getOrganizerById(Long id) {
        return organizerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Organizer not found"));
    }

}
