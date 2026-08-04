package org.example.passengerinformationdisplaysystem.feedback;

import jakarta.validation.Valid;
import org.example.passengerinformationdisplaysystem.feedback.dto.SaveFeedbackRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> createFeedback(@Valid @RequestBody SaveFeedbackRequest request) {
        service.saveFeedback(request);
        return ResponseEntity.ok().build();
    }

}
