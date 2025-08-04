package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.dto.VendorDTO;
import com.example.dto.VendorSignupDto;
import com.example.model.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

	Optional<Vendor> findById(Long id);

	boolean existsByEmail(String email);

	Optional<Vendor> findByEmailAndPassword(String email, String password);

	List<Vendor> findByCategory(String category);
	List<Vendor> findByEventId(Long eventId);
	List<Vendor> findByCategoryIgnoreCase(String category);
	
	///Search Operation
    List<Vendor> findByCategoryIgnoreCaseAndFirstNameContainingIgnoreCase(String category, String name);
    List<Vendor> findByCategoryIgnoreCaseAndLastNameContainingIgnoreCase(String category, String name);
    List<Vendor> findByCategoryIgnoreCaseAndBusinessNameContainingIgnoreCase(String category, String name);


    long countByCategory(String category);

	void save(VendorSignupDto vendorDTO);
}
