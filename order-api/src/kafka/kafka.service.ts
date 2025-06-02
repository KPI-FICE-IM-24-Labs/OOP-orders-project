import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { KafkaPayload } from '../types/kafka.payload';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer | null = null;

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.config.getOrThrow('KAFKA_CLIENT_ID'),
      brokers: [this.config.getOrThrow('KAFKA_BROKER')],
    });
  }

  public async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  public async send(topic: string, message: KafkaPayload) {
    await this.producer?.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
