import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { z } from "zod";
import { sql } from "../lib/postgres";
import postgres from "postgres";
import { redis } from "../lib/redis";

export async function shortlinksRoutes(app: FastifyInstance){
    app.post('/links', async ( request: FastifyRequest, reply: FastifyReply)  =>{
        try {
            const createLinksSchema = z.object({
                code: z.string().min(3),
                url: z.string().url()
            });
            
        
            const { code, url } = createLinksSchema.parse(request.body);
        
            const result = await sql/*sql*/`
                INSERT INTO shortlinks (code, original_url) 
                VALUES (${code}, ${url})
                RETURNING id
            `
        
            const link = result[0];
        
        
            return reply.status(201).send({
                shortLink: link
            });
        } catch (error) {
    
            if (error instanceof postgres.PostgresError){
                if (error.code === '23505'){
                    return reply.status(400).send({
                        message: 'Duplicated code.'
                    })
                }
            }
    
            return reply.status(500).send(error);
        }
    
    });
    
    
    app.get('/links', async ( request: FastifyRequest, reply: FastifyReply) =>{
            const result = await sql/*sql*/`
                SELECT * FROM shortlinks
            `
    
        const links = result;
    
    
        return reply.status(200).send(links)
    });


    app.get('/links/:code', async(request: FastifyRequest, reply: FastifyReply) =>{
        const getLinkSchema = z.object({
            code: z.string().min(3),
        });

        const { code } = getLinkSchema.parse(request.params);

        const result = await sql/*sql*/`
            SELECT id, original_url
            FROM shortlinks
            WHERE shortlinks.code = ${code}        
        `;

        if(result.length == 0){
            return reply.status(400).send({ message: 'Link does not found.'})
        }


        const link = result[0];
        
        await redis.zIncrBy('metrics', 1, String(link.id));
        return reply.redirect(301, link.original_url);
    });

    
}