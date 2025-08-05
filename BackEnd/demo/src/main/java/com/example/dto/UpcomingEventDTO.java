// Example path: com.example.dto.EventSummaryDTO

package com.example.dto;

import java.time.LocalDateTime;

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
}
