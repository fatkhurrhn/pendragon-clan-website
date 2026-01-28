# 🐉 Pendragon Clan Website

Official website for Pendragon Clan (#2Y29VCP89) - Clash of Clans

## 🚀 Features
- Real-time clan data from Supercell API
- Member list with stats
- War history and statistics
- Mobile-first responsive design
- Auto-deploy with GitHub + Vercel

## 📦 Installation

### Development
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/pendragon-clan.git
cd pendragon-clan

# Install dependencies
npm install

# Install proxy dependencies
cd proxy && npm install && cd ..

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API key

# Start development server
npm run dev