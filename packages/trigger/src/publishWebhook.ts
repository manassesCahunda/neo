import {
  app,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@neo/firebase';
import { qstash } from '@neo/qstash/client';
import { v4 as uuidv4 } from 'uuid';
import {
  logger,
  task,
} from '@trigger.dev/sdk/v3';

const db = getFirestore(app);

export const publishWebhook = task({
  id: "publish-Webhook",
  maxDuration: 120,
  run: async (payloadTrigger: { payload: {}; delayInSeconds?: number; event: {} }) => {
    const { payload, delayInSeconds = 0, event } = payloadTrigger;

    logger.info(`Publishing webhook for userId with payload: ${JSON.stringify(payload)} and event: ${JSON.stringify(event)}`);

    if (!event.url) {
      throw new Error("Event URL is required.");
    }

    try {
      const timestamp = serverTimestamp();
      const id  = uuidv4();
      const webhookDocRef = doc(db, 'webhooks',id);
      
      await setDoc(webhookDocRef, {
        id: event.id  || "",
        url: event.url || "",
        event: event.eventType  || "",
        body: payload  || "",
        timestamp,
        delayInSeconds,
      });

      logger.info(`Webhook data stored in Firestore with ID: ${timestamp}`);

      const postWebhook = await qstash.publishJSON({
        topic: 'UPLOAD_TO_EXTERNAL_PROVIDER',
        url: event.url,
        contentBasedDeduplication: true,
        body: {
          payload: {
            ...payload,
            ...event,
          },
        },
        retries: 3,
        delay: delayInSeconds,
      });

      logger.info("Webhook published successfully:", postWebhook);
      return postWebhook;
    } catch (error) {
      logger.error("Error publishing webhook:", error, error.stack);
      throw new Error(`Failed to publish webhook: ${error.message}`);
    }
  },
});
