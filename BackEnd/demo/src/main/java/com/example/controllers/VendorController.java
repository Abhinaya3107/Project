package com.example.controllers;

import com.example.dto.VendorSigninRequest;
import com.example.model.Vendor;
import com.example.repository.VendorRepository;
import com.example.service.VendorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @PostMapping("/signup")
    public ResponseEntity<String> registerVendor(@RequestBody Vendor vendor) {
        String result = vendorService.registerVendor(vendor);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signInVendor(@RequestBody VendorSigninRequest request) {
        Optional<Vendor> vendorOpt = vendorService.authenticate(request.getEmail(), request.getPassword());

        if (vendorOpt.isPresent()) {
            Vendor vendor = vendorOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("vendorId", vendor.getVid());
            response.put("vendorEmail", vendor.getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid email or password."));
        }
    }
 // Get vendors by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Vendor>> getVendorsByCategory(@PathVariable String category) {
        List<Vendor> vendors = vendorService.findByCategory(category);
        return ResponseEntity.ok(vendors);
    }

    // Get vendors by event ID
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Vendor>> getVendorsByEvent(@PathVariable Long eventId) {
        List<Vendor> vendors = vendorService.findByEventId(eventId);
        return ResponseEntity.ok(vendors);
    }

}
