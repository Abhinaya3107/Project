package com.example.dto;

import java.time.LocalDateTime;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventSummaryDTO {
	private Long id;
    private String username;
    private String eventName;
    private LocalDateTime dateTime;
    private String venue;
    private int budget;
}
