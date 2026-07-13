const express = require('express');
const router = express.Router();

// In-memory team (single user for now)
let team = [];
const MAX_TEAM_SIZE = 6;

// Get current team
router.get('/', (req, res) => {
  res.json({ team });
});

// Add a Pokémon to the team
router.post('/add', (req, res) => {
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
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing pokemon id' });
  }
  team = team.filter((p) => p.id !== id);
  res.json({ team });
});

// Clear the team
router.post('/clear', (req, res) => {
  team = [];
  res.json({ team });
});

module.exports = router; 