package org.example.passengerinformationdisplaysystem.feedback;

import jakarta.persistence.*;

import java.lang.classfile.constantpool.InvokeDynamicEntry;

@Entity
@Table(name = "feedback")
public class FeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "feedback", nullable = false)
    private String feedback;

    @Column(name = "user_metadata", nullable = false, columnDefinition = "TEXT")
    private String userMetadata;

    public FeedbackEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getUserMetadata() { return userMetadata; }
    public void setUserMetadata(String userMetadata) { this.userMetadata = userMetadata; }
}



































