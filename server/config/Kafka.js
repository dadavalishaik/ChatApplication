
// config/kafka.js
const { Kafka } = require("kafkajs");

let kafka;
let producer;

async function initKafkaProducer() {
  kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "chat-app",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  });
  producer = kafka.producer();
  await producer.connect();
  console.log("Kafka producer connected");
}

function getKafkaProducer() {
  if (!producer) throw new Error("Kafka producer not initialized");
  return producer;
}

async function produceMessage(topic, messageObj) {
  const p = getKafkaProducer();
  const payload = {
    topic,
    messages: [{ key: messageObj.conversationId || messageObj.to, value: JSON.stringify(messageObj) }],
  };
  await p.send(payload);
}

module.exports = { initKafkaProducer, produceMessage, Kafka };
