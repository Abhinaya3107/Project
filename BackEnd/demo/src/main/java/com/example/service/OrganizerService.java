package com.example.service;

import com.example.model.Organizer;
import com.example.model.Vendor;
import com.example.repository.OrganizerRepository;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;


import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OrganizerService {

    @Autowired
    private OrganizerRepository organizerRepository;

    public Organizer registerOrganizer(Organizer organizer) {
        if (organizerRepository.existsByEmail(organizer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (organizerRepository.existsByMobileNumber(organizer.getMobileNumber())) {
            throw new RuntimeException("Mobile number already registered");
        }

        return organizerRepository.save(organizer);
    }

    public List<Organizer> findAll() {
        return organizerRepository.findAll();
    }

	public Optional<Organizer> findByEmail(String email) {
		// TODO Auto-generated method stub
		return organizerRepository.findByEmail(email);
	}

	public Optional<Organizer> getOrganizerById(Long id) {
        return organizerRepository.findById(id);
    }
	 public void updateOrganizer(Long id, String firstName, String lastName, String mobileNumber,
	            String address, String organizationName, MultipartFile profileImage) throws IOException {

			Organizer organizer = organizerRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Organizer not found"));
			
			organizer.setFirstName(firstName);
			organizer.setLastName(lastName);
			organizer.setMobileNumber(mobileNumber);
			organizer.setAddress(address);
			organizer.setOrganizationName(organizationName);
			
			if (profileImage != null && !profileImage.isEmpty()) {
			organizer.setProfileImage(profileImage.getBytes()); // Save as byte[]
			}
			
			organizerRepository.save(organizer);
	}
	 public Optional<Organizer> findById(Long id) {
		    return organizerRepository.findById(id);
		}
	 public void save(Organizer organizer) {
		    organizerRepository.save(organizer);
		}


}

