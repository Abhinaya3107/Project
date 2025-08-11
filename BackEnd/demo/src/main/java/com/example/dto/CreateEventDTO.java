package com.example.dto;

import java.time.LocalDateTime;

import com.example.enums.EventStatus;
import com.example.model.User;

import lombok.Data;

@Data
public class CreateEventDTO {
	private String eventName;
    private LocalDateTime dateTime;
    private int capacity;
    private int budget;
    private String description;
    private String venue;
    private EventStatus status;
}
