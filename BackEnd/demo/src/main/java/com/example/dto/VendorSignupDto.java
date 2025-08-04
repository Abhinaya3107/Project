package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorSignupDto {
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String category;
    private String address;
    private String businessName;
    private String password;
}
