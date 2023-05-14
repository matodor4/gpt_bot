import redis from "redis";


const client = redis.createClient({
    // url: 'redis://wise_bot:wise_secret@localhost:6379'
    url: 'redis://127.0.0.1:6379'
})
client.set("key_1", "Hello");

client.get("key_1", (err, reply) => {
    if (err) throw err;
    console.log(reply);
    client.quit(); // close the client connection
});




