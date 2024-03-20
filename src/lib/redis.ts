import { createClient } from "redis";

export const redis = createClient({
    url: "redis://shortcutlinks:tzX2FkbWlu@localhost:6379"
});


redis.connect().catch(err => {
    console.error('Erro ao conectar ao cliente Redis:', err);
});


