package org.example.passengerinformationdisplaysystem.exception;

import java.time.LocalDateTime;

public record ErrorResponseDto(
        int statusCode,
        String message,
        LocalDateTime errorDate
){
}
