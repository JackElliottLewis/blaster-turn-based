import express from "express";
const app = express();
app.use(express.json());

let queue = [];
let games = {};

app.post("/queue", (req, res) => {
  const { player } = req.body;
  queue.push(player);
  if (queue.length >= 2) {
    const [p1, p2] = queue.splice(0, 2);
    const gameId = Date.now().toString();
    games[gameId] = {
      p1, p2,
      hp: { [p1]: 100, [p2]: 100 },
      turn: p1,
      winner: null
    };
    return res.json({ match: true, gameId });
  }
  res.json({ match: false });
});

app.get("/game/:id", (req, res) => {
  res.json(games[req.params.id] || {});
});

app.post("/blast", (req, res) => {
  const { gameId, player } = req.body;
  const game = games[gameId];
  if (!game || game.winner) return res.json({ error: "invalid game" });

  if (game.turn === player) {
    const target = player === game.p1 ? game.p2 : game.p1;
    const damage = Math.floor(Math.random() * 20) + 5;
    game.hp[target] -= damage;
    if (game.hp[target] <= 0) {
      game.winner = player;
    } else {
      game.turn = target;
    }
  }
  res.json(game);
});

app.listen(3000, () => console.log("Server running"));
