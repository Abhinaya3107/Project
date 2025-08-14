package com.example.dto;


import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventOrderDTO {
	private String eventName;
    private LocalDateTime dateTime;
    private int capacity;
    private int budget;
    private String venue;
}
