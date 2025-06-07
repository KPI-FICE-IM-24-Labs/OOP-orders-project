package com.quickorder.service;

import com.quickorder.dto.NotificationRequest;
import com.quickorder.model.Notification;
import com.quickorder.strategy.EmailNotificationStrategy;
import com.quickorder.strategy.NotificationStrategy;
import com.quickorder.strategy.SmsNotificationStrategy;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final KafkaNotificationProducer kafkaProducer;

    public NotificationService(KafkaNotificationProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    public void sendNotification(NotificationRequest request) {
        Notification notification = new Notification(
                request.getUserId(),
                request.getMessage(),
                request.getType()
        );

        // Strategy pattern
        NotificationStrategy strategy = switch (request.getType().toUpperCase()) {
            case "EMAIL" -> new EmailNotificationStrategy();
            case "SMS" -> new SmsNotificationStrategy();
            default -> throw new IllegalArgumentException("Unsupported notification type: " + request.getType());
        };

        strategy.send(notification); // Виконати дію
        kafkaProducer.send(notification); // Відправити в Kafka
    }
}
