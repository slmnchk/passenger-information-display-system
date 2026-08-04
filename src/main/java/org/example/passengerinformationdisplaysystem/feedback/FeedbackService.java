package org.example.passengerinformationdisplaysystem.feedback;

import org.example.passengerinformationdisplaysystem.feedback.dto.SaveFeedbackRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedbackService {

    private final FeedbackRepository repository;


    public FeedbackService(FeedbackRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void saveFeedback(SaveFeedbackRequest request) {
        FeedbackEntity entity = new FeedbackEntity();
        entity.setUserName(request.userName());
        entity.setFeedback(request.feedback());
        entity.setUserMetadata(request.userMetadata());
        repository.save(entity);
    }

}
