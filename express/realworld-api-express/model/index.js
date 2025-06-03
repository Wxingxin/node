const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, {
  // 不再需要 useNewUrlParser 和 useUnifiedTopology
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    // ... 你的操作
  } finally {
    await client.close();
  }
}
run().catch(console.dir);