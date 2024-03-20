import fastify from "fastify";
import { shortlinksRoutes } from "./routes/shortlinksRoutes";
import { metricsRoutes } from "./routes/metricsRoutes";
const app = fastify({
    logger: true
});

app.register(metricsRoutes, { prefix: '/api' });
app.register(shortlinksRoutes, { prefix: '/api'} );

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() =>{
    console.log('HTTP server running!');
});