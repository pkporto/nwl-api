import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/question',
    {
      schema: {
        body: z.object({
          question: z.string().min(5),
        }),
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { question } = req.body;
      const { roomId } = req.params;

      const result = await db
        .insert(schema.questions)
        .values({ roomId, question })
        .returning();

      const insertedRomm = result[0];

      if (!insertedRomm) {
        throw new Error('Failed to create question.');
      }

      return res.status(201).send({ roomId: insertedRomm.id });
    }
  );
};
