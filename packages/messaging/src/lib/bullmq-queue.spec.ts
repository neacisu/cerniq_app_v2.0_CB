import {
  CERNIQ_BULLMQ_PREFIX,
  dlqQueueName,
  qualifyQueueName,
} from './bullmq-queue.js';

describe('bullmq-queue naming', () => {
  it('qualifyQueueName adaugă prefix o singură dată', () => {
    expect(qualifyQueueName('imports')).toBe(`${CERNIQ_BULLMQ_PREFIX}imports`);
    expect(qualifyQueueName(`${CERNIQ_BULLMQ_PREFIX}x`)).toBe(
      `${CERNIQ_BULLMQ_PREFIX}x`
    );
  });

  it('dlqQueueName folosește sufix :dlq', () => {
    expect(dlqQueueName('job')).toBe(`${CERNIQ_BULLMQ_PREFIX}job:dlq`);
  });
});
