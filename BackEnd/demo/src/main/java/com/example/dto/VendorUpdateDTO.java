package com.example.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.model.EventStatus;

import lombok.Data;
@Data
public class VendorUpdateDTO {
	private String eventName;
    private LocalDateTime dateTime;
    private String category;
    private int capacity;
    private String venue;
    private EventStatus status;
    private List<VendoDTO1> vendors;
}
