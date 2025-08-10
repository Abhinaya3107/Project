package com.example.controllers;
import com.example.dto.VendorDTO;
import com.example.dto.*;


import com.example.dto.VendorSigninRequest;
import com.example.model.Event;
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

    // Get all vendors (for debugging)
    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        List<Vendor> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }

    // Vendor Signup
    @PostMapping("/signup")
    public ResponseEntity<String> registerVendor(@RequestBody VendorSignupDto dto) {
        vendorService.registerVendor(dto); // call the void method
        return ResponseEntity.ok("Vendor registered successfully");
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
        System.out.println("Requesting vendors for category: " + category);
        List<Vendor> vendors = vendorService.findByCategory(category);
        System.out.println("Found " + vendors.size() + " vendors for category: " + category);
        return ResponseEntity.ok(vendors);
    }
    
    // Test endpoint - get vendors by category without relationships
    @GetMapping("/category-simple/{category}")
    public ResponseEntity<List<Map<String, Object>>> getVendorsByCategorySimple(@PathVariable String category) {
        System.out.println("Requesting simple vendors for category: " + category);
        List<Vendor> vendors = vendorService.findByCategory(category);
        System.out.println("Found " + vendors.size() + " vendors for category: " + category);
        
        List<Map<String, Object>> simpleVendors = vendors.stream()
            .map(vendor -> {
                Map<String, Object> simple = new HashMap<>();
                simple.put("vid", vendor.getVid());
                simple.put("firstName", vendor.getFirstName());
                simple.put("lastName", vendor.getLastName());
                simple.put("category", vendor.getCategory());
                simple.put("email", vendor.getEmail());
                simple.put("mobile", vendor.getMobile());
                simple.put("businessName", vendor.getBusinessName());
                simple.put("status", vendor.getStatus());
                return simple;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(simpleVendors);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        if (!vendorService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vendorService.deleteById(id);
        return ResponseEntity.ok("Vendor deleted successfully");
    }
   
    //GetData By Searching
    @GetMapping("/search")
    public List<Vendor> searchByNameAndCategory(
        @RequestParam String category,
        @RequestParam String term
    ) {
        return vendorService.searchByCategoryAndName(category, term);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getVendorCountByCategory(@RequestParam String category) {
        long count = vendorService.countVendorsByCategory(category);
        return ResponseEntity.ok(count);
    }
    
    //GEt Businessname of photography
    @GetMapping("/business-names/photography")
    public List<String> getPhotographyBusinessNames() {
        return vendorService.getBusinessNamesByCategory("photography");
    }
    @GetMapping("/business-names/caterer")
    public List<String> getCatererBusinessNames() {
        return vendorService.getBusinessNamesByCategory("caterer");
    }
    
    @GetMapping("/{vendorId}/events")
    public List<Event> getVendorEvents(@PathVariable Long vendorId) {
        return vendorService.getVendorEvents(vendorId);
    }
////////////////////FORGET PASSWORD AND RESET/////////////
@PostMapping("/vendor/forgot-password/check")
public ResponseEntity<?> checkVendorEmail(@RequestBody Map<String, String> payload) {
String email = payload.get("email").trim().toLowerCase();
Optional<Vendor> vendorOpt = vendorService.findByEmail(email);

return ResponseEntity.ok(Map.of("exists", vendorOpt.isPresent()));
}

@PostMapping("/forgot-password/reset")
public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
    String email = payload.get("email").trim().toLowerCase();
    String newPassword = payload.get("newPassword").trim();

    Optional<Vendor> vendorOpt = vendorService.findByEmail(email);
    if (vendorOpt.isPresent()) {
        Vendor vendor = vendorOpt.get();
        vendor.setPassword(newPassword); // 🔐 Consider hashing in production
        vendorService.save(vendor);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of("message", "Email not found"));
}

}
