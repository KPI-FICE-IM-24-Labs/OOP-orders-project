package com.quickorder.service;

import com.quickorder.model.Notification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaNotificationProducer {

    private final KafkaTemplate<String, Notification> kafkaTemplate;

    public KafkaNotificationProducer(KafkaTemplate<String, Notification> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(Notification notification) {
        kafkaTemplate.send("notification-topic", notification);
        System.out.println("📤 Sent notification to Kafka: " + notification.getMessage());
    }
}
