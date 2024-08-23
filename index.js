const { Pool } = require("pg");

let pool;


const selectAllPlayers = async (p) => {
  const client = await p.connect();
  console.log("Hey! You successfully connected to your CockroachDB cluster.");
  try {
    return await client.query(
      "SELECT * from player ORDER BY game_score DESC"
    ) 
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

exports.handler = async (event, context) => {
  console.log(`event: ${JSON.stringify(event)}`);

  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "$ docs_lambda_node",
      max: 1,
    });
  }
  
  const rs = await selectAllPlayers(pool);
  const players = rs.rows;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(players),
  };  
};
