<<<<<<< HEAD
import com.example.dto.VendorDTO;
=======
package com.example.controllers;
>>>>>>> c386f41bf25d56bcaf96b6601cd8e26d7554187d

import com.example.dto.VendorSigninRequest;
import com.example.model.Vendor;
import com.example.service.VendorService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    
    
    // Vendor Signup
    @PostMapping("/signup")
    public ResponseEntity<String> registerVendor(@RequestBody Vendor vendor) {
        String result = vendorService.registerVendor(vendor);
        return ResponseEntity.ok(result);
    }

    // Vendor Signin
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

    // ✅ Get vendor profile by ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getVendorProfile(@PathVariable Long id) {
        Optional<Vendor> vendorOpt = vendorService.getVendorById(id);

        if (vendorOpt.isPresent()) {
            return ResponseEntity.ok(vendorOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vendor not found");
        }
    }


    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateVendorProfile(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("mobile") String mobile,
            @RequestParam("address") String address,
            @RequestParam("businessName") String businessName,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            // You’ll need to modify your service to accept these parameters
            vendorService.updateVendor(id, firstName, lastName, mobile, address, businessName, profileImage);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vendor not found");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process image");
        }
    }
    
    @GetMapping("/summary")
    public List<VendorDTO> getVendorSummary() {
        return vendorService.getVendorSummary();
    }

   
}
