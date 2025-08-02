package com.example.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {
    private Long vid;
    private String businessName;
    private String mobile;
    private String status;
}
