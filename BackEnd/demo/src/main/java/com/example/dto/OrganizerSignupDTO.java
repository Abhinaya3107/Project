package com.example.dto;

import lombok.Data;

@Data
public class OrganizerSignupDTO {

  
    private String firstName;

    private String lastName;

    private String email;

    private String mobileNumber;

    private String address;

    private String organizationName;

    private String category; // Will validate only Photography or Caterer in controller

    private String password;
}
