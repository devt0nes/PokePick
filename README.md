# PokéPick - Pokémon Team Builder

A full-stack Pokémon team building application built with Next.js frontend and Express.js backend.

## 🎮 Features

### Frontend (Next.js)
- **Pokémon Browser**: Browse all original Pokémon with stats and images
- **Team Management**: Build and manage your Pokémon team
- **Advanced Filtering**: Search by name, filter by type, sort by stats
- **Infinite Scroll**: Smooth pagination for browsing Pokémon
- **Contact Form**: Get in touch with feedback
- **Admin Panel**: Manage contact messages

### Backend (Express.js)
- **Team API**: Add, remove, and manage Pokémon teams
- **Contact API**: Handle contact form submissions
- **RESTful Endpoints**: Clean API design
- **CORS Support**: Cross-origin resource sharing
- **In-Memory Storage**: Fast development with option to upgrade

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pokepick.git
   cd pokepick
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm start
   # or
   node index.js
   ```

5. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📁 Project Structure

```
pokepick/
├── frontend/             # Next.js frontend
│   ├── app/             # Next.js app directory
│   │   ├── page.tsx     # Home page
│   │   ├── contact/     # Contact page
│   │   ├── admin/       # Admin panel
│   │   ├── layout.tsx   # Root layout
│   │   └── globals.css  # Global styles
│   ├── pokemon/         # Pokémon components
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   └── next.config.ts   # Next.js config
├── backend/             # Express.js backend
│   ├── index.js        # Main server file
│   ├── routes/         # API routes
│   │   ├── teams.js    # Team management
│   │   └── contact.js  # Contact form
│   └── package.json    # Backend dependencies
└── README.md          # This file
```

## 🔧 API Endpoints

### Team Management
- `GET /api/team` - Get current team
- `POST /api/team/add` - Add Pokémon to team
- `POST /api/team/remove` - Remove Pokémon from team
- `POST /api/team/clear` - Clear entire team

### Contact Management
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/messages` - Get all messages (admin)
- `PUT /api/contact/messages/:id/read` - Mark as read
- `DELETE /api/contact/messages/:id` - Delete message

## 🎯 Usage

### Building a Team
1. Browse Pokémon on the home page
2. Click on a Pokémon card to open details
3. Select up to 4 moves for your Pokémon
4. Click "Add to Team" to add to your team
5. View your team in the sidebar

### Managing Your Team
- **View Team**: Team appears in the collapsible sidebar
- **Remove Pokémon**: Click the X button on team members
- **Clear Team**: Use the "Clear All" button
- **Move Selection**: Choose moves in the Pokémon modal

### Filtering and Search
- **Search**: Type Pokémon names to filter
- **Type Filter**: Click type buttons to filter by type
- **Stat Sorting**: Sort by HP, Attack, Defense, etc.
- **Clear Filters**: Reset all filters with one button

## 🛠️ Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm start           # Start development server
npm run dev         # Start with nodemon (if configured)
```

### Environment Variables
Create `.env` files as needed:

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend (.env):**
```env
PORT=4000
NODE_ENV=development
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables

### Backend (Railway/Render/Heroku)
1. Deploy the `backend/` directory
2. Set environment variables
3. Configure the port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Pokémon data from [PokeAPI](https://pokeapi.co/)
- Icons and assets from various sources
- Built with Next.js, React, Tailwind CSS, and Express.js 
