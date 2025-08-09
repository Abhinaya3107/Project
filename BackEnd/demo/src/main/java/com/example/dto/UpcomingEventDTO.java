package com.example.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.enums.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpcomingEventDTO {
    private Long id;
    private String eventName;
    private String venue;
    private LocalDateTime dateTime;
    private String status;
    private int budget;
    private int capacity;
    private List<VendorIdDTO> vendors;

    public UpcomingEventDTO(Long id, String eventName, String venue,
                            LocalDateTime dateTime, String status,
                            int budget, int capacity,
                            List<VendorIdDTO> vendors) {
        this.id = id;
        this.eventName = eventName;
        this.venue = venue;
        this.dateTime = dateTime;
        this.status = status;
        this.budget = budget;
        this.capacity = capacity;
        this.vendors = vendors;
    }

    public UpcomingEventDTO(Long id, String eventName, String venue,
                            LocalDateTime dateTime, EventStatus status, int budget) {
        this.id = id;
        this.eventName = eventName;
        this.venue = venue;
        this.dateTime = dateTime;
        this.status = status.name();
        this.budget = budget;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VendorIdDTO {
        private Long vid;
    }
}

