package com.example.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String mobile;
    private String businessName;
    private String status;
}

