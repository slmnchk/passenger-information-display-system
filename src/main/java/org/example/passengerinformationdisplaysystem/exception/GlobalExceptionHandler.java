package org.example.passengerinformationdisplaysystem.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception e) {
        log.error("Exception: {}", e.getMessage());
        String message = e.getMessage() != null ? e.getMessage() : "An unexpected server error occurred";

        var errorDto = new ErrorResponseDto(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                message,
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDto);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErrorResponseDto> handleBadRequestException(Exception e) {
        log.error("Exception: {}", e.getMessage());
        String message = e.getMessage() != null ? e.getMessage() : "Invalid request parameters";

        var errorDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                message,
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationException(MethodArgumentNotValidException e) {
        String detailedMessage = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.error("Validation failed: {}", detailedMessage);

        var errorDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed: " + detailedMessage,
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto);
    }
}