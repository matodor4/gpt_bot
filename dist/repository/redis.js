import redis from "redis";
const client = redis.createClient({
    // url: 'redis://wise_bot:wise_secret@localhost:6379'
    url: 'redis://127.0.0.1:6379'
});
await client.connect();
