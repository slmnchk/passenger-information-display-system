package org.example.passengerinformationdisplaysystem.feedback.dto;

import jakarta.validation.constraints.NotBlank;

public record SaveFeedbackRequest(
        @NotBlank(message = "User has to have a name")
        String userName,

        @NotBlank(message = "User has to leave a message")
        String feedback,

        @NotBlank(message = "User has to be spied")
        String userMetadata
) {}
