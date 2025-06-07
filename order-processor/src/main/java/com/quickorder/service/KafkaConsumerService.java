package com.quickorder.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private final OrderService orderService;

    public KafkaConsumerService(OrderService orderService) {
        this.orderService = orderService;
    }

    // Observer pattern — реагує на події з Kafka
    @KafkaListener(topics = "order-events", groupId = "order-processor-group")
    public void consumeOrderEvent(String message) {
        System.out.println("Received Kafka message: " + message);

        // Тут можна розпарсити повідомлення і виконати додаткову логіку
        // Наприклад, оновити статус замовлення або логувати подію
    }
}
