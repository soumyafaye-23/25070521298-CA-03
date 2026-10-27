# Lumière

A full-stack restaurant ordering and reservation website.

## Stack

- React with JavaScript, powered by Next.js
- Node.js and Express REST API
- MongoDB with Mongoose
- Tailwind CSS, Lucide icons, and Framer Motion

The client source is JavaScript (.js / .jsx); TypeScript is not used.

## Run locally

Requirements: Node.js 18 or newer. On Windows, use the [official MongoDB Windows setup guide](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/) to install MongoDB as a service, or run `.\scripts\start-mongodb.ps1` for a user-local setup. The script downloads MongoDB Community Server the first time it is needed, starts it on `127.0.0.1:27017`, and stores the database outside the synced project folder.

1. Start MongoDB using the option above.
2. In a terminal, install and start the API:

   ~~~powershell
   cd Server
   npm install
   npm run dev
   ~~~

3. In another terminal, install and start the website:

   ~~~powershell
   cd Client
   npm install
   npm run dev
   ~~~

4. Open http://localhost:3000.

The API is available at http://localhost:5000. The default MongoDB URI is mongodb://127.0.0.1:27017/lumiere_restaurant. The menu collection seeds itself on first request; run npm run seed from Server if you want to reseed it.

## Main pages

- / — restaurant introduction and featured dishes
- /menu — searchable menu and cart actions
- /reservation — booking and table selection
- /cart — checkout and order invoice
- /track-order — order status lookup
- /login — sign in or create an account

## API health

GET /api/health returns the API status and MongoDB connection state.
