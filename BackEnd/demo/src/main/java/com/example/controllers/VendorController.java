package com.example.controllers;

import com.example.model.Vendor;
import com.example.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    // ✅ SIGNUP: Save vendor
    @PostMapping("/signup")
    public ResponseEntity<String> registerVendor(@RequestBody Vendor vendor) {
        try {
            Optional<Vendor> existingVendor = vendorService.findByEmail(vendor.getEmail());
            if (existingVendor.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists!");
            }

            vendorService.save(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body("Vendor registered successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during vendor registration.");
        }
    }

    // ✅ SIGNIN: Login vendor
    @PostMapping("/signin")
    public ResponseEntity<?> loginVendor(@RequestBody Vendor loginRequest) {
        Optional<Vendor> vendor = vendorService.findByEmailAndPassword(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        if (vendor.isPresent()) {
            Vendor loggedInVendor = vendor.get();

            return ResponseEntity.ok().body(
                Map.of(
                    "message", "Login successful!",
                    "vendor", Map.of(
                        "id", loggedInVendor.getId(),
                        "firstName", loggedInVendor.getFirstName(),
                        "lastName", loggedInVendor.getLastName(),
                        "email", loggedInVendor.getEmail(),
                        "mobile", loggedInVendor.getMobile(),
                        "category", loggedInVendor.getCategory()
                    )
                )
            );
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }
}
