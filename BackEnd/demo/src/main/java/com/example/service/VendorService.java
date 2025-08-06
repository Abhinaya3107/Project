
package com.example.service;


import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import com.example.dto.VendorDTO;

import com.example.dto.VendorProfileDTO;
<<<<<<< HEAD

import com.example.dto.VendorSignupDto;

=======
>>>>>>> origin/Password

import com.example.dto.VendorSignupDto;

import com.example.dto.VendorSigninRequest;
import com.example.model.User;
<<<<<<< HEAD

=======
>>>>>>> origin/Password
import com.example.model.Vendor;
import com.example.repository.VendorRepository;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;
    
    public Optional<Vendor> authenticate(String email, String password) {
        return vendorRepository.findByEmailAndPassword(email, password);
    }

    public void registerVendor(VendorSignupDto dto) {
        Vendor vendor = new Vendor();
        vendor.setFirstName(dto.getFirstName());
        vendor.setLastName(dto.getLastName());
        vendor.setEmail(dto.getEmail());
        vendor.setMobile(dto.getMobile());
        vendor.setCategory(dto.getCategory());
        vendor.setPassword(dto.getPassword());
        vendor.setAddress(dto.getAddress());
        vendor.setBusinessName(dto.getBusinessName());
        vendor.setStatus("available"); // Default status if needed

        vendorRepository.save(vendor); // ✅ Now save entity, not DTO
    }
<<<<<<< HEAD

=======
    
>>>>>>> origin/Password
    
    public void deleteById(Long id) {
        vendorRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return vendorRepository.existsById(id);
    }
    

    public List<Vendor> findByCategory(String category) {
        return vendorRepository.findByCategory(category);
    }

    public List<Vendor> findByEventId(Long eventId) {
        return vendorRepository.findByEventId(eventId);
    }

    // 🔽 ADD THESE METHODS FOR PROFILE VIEW/UPDATE

    public Optional<Vendor> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    public void updateVendor(Long id, String firstName, String lastName, String mobile,
            String address, String businessName, MultipartFile profileImage) throws IOException {

		Vendor vendor = vendorRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("Vendor not found"));
		
		vendor.setFirstName(firstName);
		vendor.setLastName(lastName);
		vendor.setMobile(mobile);
		vendor.setAddress(address);
		vendor.setBusinessName(businessName);
		
		if (profileImage != null && !profileImage.isEmpty()) {
		vendor.setProfileImage(profileImage.getBytes()); // Save as byte[]
		}
		
		vendorRepository.save(vendor);
}

    
    public List<VendorDTO> getVendorSummary() {
        List<Vendor> vendors = vendorRepository.findAll();
        return vendors.stream()
                .map(v -> new VendorDTO(v.getVid(), v.getBusinessName(), v.getMobile(), v.getStatus()))
                .collect(Collectors.toList());
    }

    public List<VendorProfileDTO> getVendorsByCategory(String category) {
        List<Vendor> vendors = vendorRepository.findByCategoryIgnoreCase(category);
        return vendors.stream()
                .map(v -> new VendorProfileDTO(
                    v.getVid(),
                    v.getFirstName(),
                    v.getLastName(),
                    v.getMobile(),
                    v.getBusinessName(),
                    v.getStatus()
                ))
                .collect(Collectors.toList());
        
     

    }

  
    public List<Vendor> searchByCategoryAndName1(String category, String name) {
        List<Vendor> combined = new ArrayList<>();
        combined.addAll(vendorRepository.findByCategoryIgnoreCaseAndFirstNameContainingIgnoreCase(category, name));
        combined.addAll(vendorRepository.findByCategoryIgnoreCaseAndLastNameContainingIgnoreCase(category, name));
        combined.addAll(vendorRepository.findByCategoryIgnoreCaseAndBusinessNameContainingIgnoreCase(category, name));

        // Remove duplicates based on vid
        Map<Long, Vendor> uniqueMap = new LinkedHashMap<>();
        for (Vendor v : combined) {
            uniqueMap.putIfAbsent(v.getVid(), v);
        }

        return new ArrayList<>(uniqueMap.values());

    }

    public List<Vendor> searchByCategoryAndName(String category, String name) {
        List<Vendor> combined = new ArrayList<>();
        combined.addAll(vendorRepository.findByCategoryIgnoreCaseAndFirstNameContainingIgnoreCase(category, name));
        combined.addAll(vendorRepository.findByCategoryIgnoreCaseAndLastNameContainingIgnoreCase(category, name));
        combined.addAll(vendorRepository.findByCategoryIgnoreCaseAndBusinessNameContainingIgnoreCase(category, name));

        // Remove duplicates based on vid
        Map<Long, Vendor> uniqueMap = new LinkedHashMap<>();
        for (Vendor v : combined) {
            uniqueMap.putIfAbsent(v.getVid(), v);
        }

        return new ArrayList<>(uniqueMap.values());
    }

    public long countVendorsByCategory(String category) {
        return vendorRepository.countByCategory(category);
    }
    //Get Category Name
    public List<String> getBusinessNamesByCategory(String category) {
        List<Vendor> vendors = vendorRepository.findAllByCategory(category);  // renamed method
        return vendors.stream()
                      .map(Vendor::getBusinessName)
                      .collect(Collectors.toList());
    }

    public Optional<Vendor> findByEmail(String email) {
<<<<<<< HEAD
        return vendorRepository.findByEmail(email); // ✅ Correct
=======
        return vendorRepository.findByEmail(email);
>>>>>>> origin/Password
    }

	public void save(Vendor existingVendor) {
		// TODO Auto-generated method stub
		
	}
	public Optional<Vendor> findById(Long id) {
	    return vendorRepository.findById(id);
	}
<<<<<<< HEAD

=======
>>>>>>> origin/Password
	
}
