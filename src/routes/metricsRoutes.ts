import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { redis } from "../lib/redis";

export async function metricsRoutes(app: FastifyInstance){
    app.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) =>{

        const result =  await redis.zRangeByScoreWithScores('metrics', 0, 50);

        const metrics =  result
        .sort((a, b) => b.score - a.score)
        .map(item => {
            return {
                shortLinkId: Number(item.value),
                clicks: item.score
            }

        })

        return metrics;

    });
}