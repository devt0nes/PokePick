# PokéPick Backend API

A Node.js/Express backend API for the PokéPick application, providing team management and contact form functionality.

## Features

- **Pokémon Team Management**: Add, remove, and manage Pokémon teams
- **Contact Form Processing**: Handle contact form submissions
- **RESTful API**: Clean API endpoints for frontend integration
- **CORS Support**: Cross-origin resource sharing enabled
- **In-Memory Storage**: Fast development with option to upgrade to database

## API Endpoints

### Team Management
- `GET /api/team` - Get current team
- `POST /api/team/add` - Add Pokémon to team
- `POST /api/team/remove` - Remove Pokémon from team
- `POST /api/team/clear` - Clear entire team

### Contact Management
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/messages` - Get all contact messages (admin)
- `PUT /api/contact/messages/:id/read` - Mark message as read
- `DELETE /api/contact/messages/:id` - Delete message

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pokepick-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   # or
   node index.js
   ```

The server will start on `http://localhost:4000`

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
NODE_ENV=development
```

## Usage Examples

### Add Pokémon to Team
```bash
curl -X POST http://localhost:4000/api/team/add \
  -H "Content-Type: application/json" \
  -d '{
    "pokemon": {
      "id": 25,
      "name": "pikachu",
      "image": "https://...",
      "types": [...],
      "stats": {...},
      "moves": ["thunderbolt", "quick-attack", "iron-tail", "thunder"]
    }
  }'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:4000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "general",
    "message": "Hello, I have a question..."
  }'
```

## Project Structure

```
backend/
├── index.js          # Main server file
├── routes/
│   ├── teams.js      # Team management routes
│   └── contact.js    # Contact form routes
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Development

### Adding New Routes
1. Create a new route file in `routes/`
2. Export the router
3. Import and use in `index.js`

### Database Integration
Currently using in-memory storage. To add a database:
1. Install database driver (e.g., `npm install sqlite3`)
2. Update route handlers to use database
3. Add database connection and models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 
