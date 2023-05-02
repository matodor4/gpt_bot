import redis from "redis";
const client = redis.createClient({
    // url: 'redis://wise_bot:wise_secret@localhost:6379'
    url: 'redis://127.0.0.1:6379'
});
await client.connect();
client.set("key_1", "Hello");
const val = await client.get("key_1");
console.log("Hello World! ", val);
client.quit();
