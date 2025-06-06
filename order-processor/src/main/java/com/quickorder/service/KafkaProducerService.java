package com.quickorder.service;

import com.quickorder.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service // Singleton by default in Spring
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // Adapter method to send events
    public void sendOrderCreatedEvent(Order order) {
        String message = String.format("Order created: id=%s, user=%s, product=%s, qty=%d",
                order.getId(), order.getUserId(), order.getProduct(), order.getQuantity());

        kafkaTemplate.send("order-events", message);
        System.out.println("Sent message to Kafka: " + message);
    }
}