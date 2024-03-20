import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { redis } from "../lib/redis";

export async function metricsRoutes(app: FastifyInstance){
    app.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) =>{

        const metrics =  await redis.zRangeByScoreWithScores('metrics', 0, 50);

        const result = metrics.sort();

        return result;

    });
}