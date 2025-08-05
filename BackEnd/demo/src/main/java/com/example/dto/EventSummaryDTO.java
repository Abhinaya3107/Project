package com.example.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventSummaryDTO {
	private Long id;
    private String username;
    private String eventName;
    private String dateTime;
    private String venue;
    private int budget;
}
