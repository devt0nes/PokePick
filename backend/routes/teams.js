const express = require('express');
const router = express.Router();

const teams = {};
const MAX_TEAM_SIZE = 6;

// Helper: get the current client's team
function getTeam(req) {
  const clientId = req.header("x-client-id");

  if (!clientId) {
    return null;
  }

  if (!teams[clientId]) {
    teams[clientId] = [];
  }

  return teams[clientId];
}

// Get current team
router.get('/', (req, res) => {
  const team = getTeam(req);
  if (!team) {
    return res.status(400).json({
      error: "Missing client id",
    });
  }

  res.json({ team });
});

// Add a Pokémon to the team
router.post('/add', (req, res) => {
  const team = getTeam(req);
  if (!team) {
    return res.status(400).json({
      error: "Missing client id",
    });
  }

  const { pokemon } = req.body;
  if (!pokemon || !pokemon.id) {
    return res.status(400).json({ error: 'Missing pokemon data or id' });
  }
  if (team.find((p) => p.id === pokemon.id)) {
    return res.status(400).json({ error: 'Pokemon already in team' });
  }
  if (team.length >= MAX_TEAM_SIZE) {
    return res.status(400).json({ error: 'Team cannot have more than 6 Pokémon' });
  }
  team.push(pokemon);
  res.json({ team });
});

// Remove a Pokémon from the team
router.post('/remove', (req, res) => {
  const team = getTeam(req);
  if (!team) {
    return res.status(400).json({
      error: "Missing client id",
    });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing pokemon id' });
  }
  const index = team.findIndex((p) => p.id === id);
  if (index !== -1) {
    team.splice(index, 1);
  }

  res.json({ team });
});

// Clear the team
router.post('/clear', (req, res) => {
  const team = getTeam(req);
  if (!team) {
    return res.status(400).json({
      error: "Missing client id",
    });
  }

  team.length = 0;

  res.json({ team });
});

module.exports = router;