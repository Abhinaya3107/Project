// Example path: com.example.dto.EventSummaryDTO

package com.example.dto;

import java.time.LocalDateTime;

import com.example.model.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpcomingEventDTO {
	private Long id;
    private String eventName;
    private String venue;
    private LocalDateTime dateTime;
    private String status;
    private int budget;

    
    public UpcomingEventDTO(Long id, String eventName, String venue, LocalDateTime dateTime, EventStatus status, int budget) {
        this.id = id;
        this.eventName = eventName;
        this.venue = venue;
        this.dateTime = dateTime;
        this.status = status.name(); // Convert enum to string if needed
        this.budget = budget;
    }

    private int capacity;

}
