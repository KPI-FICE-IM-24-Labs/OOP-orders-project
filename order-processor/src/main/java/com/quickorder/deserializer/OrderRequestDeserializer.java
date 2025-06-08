package com.quickorder.deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.quickorder.model.OrderRequest;
import org.apache.kafka.common.serialization.Deserializer;

public class OrderRequestDeserializer implements Deserializer<OrderRequest> {

    private final ObjectMapper objectMapper;

    public OrderRequestDeserializer() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public OrderRequest deserialize(String topic, byte[] data) {
        try {
            if (data == null) return null;
            return objectMapper.readValue(data, OrderRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize OrderRequest", e);
        }
    }

    @Override
    public void close() {
        // Nothing to close
    }
}