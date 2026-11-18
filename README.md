WedBash 🎉
Make every wedding guest part of the celebration.

WedBash is a wedding entertainment platform designed to make Indian
weddings more interactive, engaging, and memorable. It lets wedding
organizers create games and questions, invite guests through a unique
wedding link or QR code, and run live activities where the bride's and
groom's sides can participate, compete, and celebrate together.
Product status: Planning / early development. Features and
technical decisions may evolve as the MVP is implemented.

✨ Product vision
Traditional wedding celebrations bring families and friends together,
but many guests are only spectators. WedBash aims to turn guests into
active participants through fun questions, friendly competition, live
game sessions, leaderboards, and memorable moments.
The core experience
1. An organizer creates a wedding on WedBash.
2. The organizer prepares questions and configures a game.
3. WedBash generates a unique invitation link and QR code for that
   wedding.
4. Guests open the link, enter a display name, and choose Bride's
   Side or Groom's Side.
5. The organizer starts and controls the game.
6. Guests answer questions and earn points according to the game's
   rules.
7. Results and leaderboards help reveal the most engaged guests.
8. The organizer can announce winners and record gifts or rewards.
The platform is intended to make wedding entertainment easy to set up
for organizers and simple to join for guests.
🎯 MVP scope
The first release focuses on delivering one complete and reliable
wedding-game experience.
Organizer
- Register and log in securely.
- Access an organizer dashboard.
- Create, view, update, and manage weddings.
- Create and manage questions and answer options.
- Configure question settings such as points, duration, audience, and
  order.
- Generate a public wedding invitation link and QR code.
- Start, pause, resume, advance, and end a game session.
- View participants, answers, scores, and results.
- View a leaderboard and record winner details.
Guest
- Join a wedding using its public link or QR code.
- Enter a display name without creating a full account.
- Select Bride's Side or Groom's Side.
- Participate in an active game.
- Submit answers within the allowed rules and time.
- View permitted results and leaderboard information.
Platform administration
A platform-level Superadmin role is planned for managing organizers and
platform operations. Subscription and payment functionality can be
introduced after the core game experience is working.
Planned for later
- Couple journey photos and videos.
- Subscription plans and online payments.
- Expanded event types and game formats.
- Additional engagement and customization features.
👥 User roles
  Role                                Responsibilities
  Superadmin                      Manages the platform, organizer
accounts, and platform-level
operations.

  Organizer                       Creates weddings, prepares games,
invites guests, controls live
sessions, and reviews results.
Guest                           Joins a specific wedding and
participates in its games without a
normal registered account.
Guest access is wedding-scoped. A public wedding link identifies the
wedding; it does not, by itself, authenticate a guest session.
🧰 Technology stack
The planned stack is:

  Layer                     Technology
  Frontend                  Next.js, React, TypeScript
Styling                   Tailwind CSS
Backend                   Node.js, Express.js, TypeScript
API style                 REST API
Database                  PostgreSQL
ORM                       Prisma
Validation                Zod
Real-time communication   Socket.IO
Media storage             Cloudinary or S3-compatible object storage

The backend is planned as a modular monolith. The application will
be organized by business modules rather than split into microservices
during the MVP.
🏗️ High-level architecture
                  ┌──────────────────────────┐
                  │       Next.js App        │
                  │ Organizer + Guest UI     │
                  └────────────┬─────────────┘
                               │
                     REST API │ Socket.IO
                               │
                  ┌────────────▼─────────────┐
                  │    Node.js + Express     │
                  │                          │
                  │ Auth / Weddings          │
                  │ Questions / Guests       │
                  │ Games / Answers          │
                  │ Results / Admin          │
                  └───────┬─────────┬────────┘
                          │         │
                    Prisma ORM     │ Socket.IO
                          │         │
                  ┌───────▼─────┐   │
                  │ PostgreSQL  │   │
                  └─────────────┘   │
                                    │
                          Real-time clients
REST APIs are the source of truth for application data. Socket.IO is
used for live game updates and communication. The server validates game
state and answer submissions; clients must not determine their own
scores or correctness.
📁 Planned repository structure
The exact structure may change during implementation. A suggested
starting point is:
wedbash/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
│
├── backend/                  # Express API and Socket.IO server
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── weddings/
│   │   │   ├── questions/
│   │   │   ├── guests/
│   │   │   ├── games/
│   │   │   ├── answers/
│   │   │   └── results/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── README.md
└── .gitignore
Backend module pattern
Backend modules should keep responsibilities separate:
weddings/
├── wedding.routes.ts
├── wedding.controller.ts
├── wedding.service.ts
├── wedding.repository.ts
├── wedding.validation.ts
└── wedding.types.ts
- Routes: Define endpoints and attach middleware.
- Controllers: Handle HTTP requests and responses.
- Services: Contain business rules and coordinate operations.
- Repositories: Encapsulate database queries.
- Validation: Define and enforce request schemas.
- Sockets: Handle real-time events separately from HTTP
  controllers.
🔐 Security and data integrity principles
Security is part of the product foundation, not a final polishing task.
- Keep organizer authentication separate from guest sessions.
- Store passwords using a secure password-hashing algorithm.
- Use secure, HTTP-only cookies for session credentials where
  appropriate.
- Do not allow public registration to assign privileged roles.
- Scope organizer data access to the authenticated organizer.
- Bind guest sessions to a specific wedding.
- Derive guest identity from the validated guest session, not from a
  client-supplied guest ID.
- Validate the wedding, participant, question, game state, and
  submission deadline on the server.
- Never send correct answers or answer keys to guest clients before
  they should be revealed.
- Calculate scores on the server; never trust scores submitted by the
  browser.
- Prevent duplicate submissions according to each question's
  configured rules.
- Use database constraints and transactions for important game and
  scoring operations.
- Re-fetch the current game snapshot after a guest or organizer
  reconnects.
🎮 Real-time game flow
A typical live session is expected to work as follows:
1. The organizer starts a game.
2. The backend updates the persisted game state.
3. The backend emits a Socket.IO event to connected participants.
4. The organizer activates or advances to a question.
5. Connected guests receive the question and its permitted details.
6. Guests submit answers through validated backend endpoints.
7. The backend checks eligibility, game state, deadlines, and
   duplicate-submission rules.
8. The backend stores the answer and calculates the score.
9. Updated results are made available to the organizer and, when
   configured, guests.
10. If a client disconnects, it can reconnect and retrieve the latest
    persisted game state.
The database remains authoritative. Socket events notify clients of
changes; they do not replace persisted state.
🗺️ Development roadmap
The implementation will proceed in dependency order:
  Phase                               Work
  1. Product foundation              Confirm MVP rules, initialize
repository, configure tooling and
environments.

  2. Database foundation             Design the PostgreSQL schema,
configure Prisma, and establish
migrations.

  3. Frontend foundation             Build the landing page and
application layout.

  4. Organizer authentication        Implement registration, login,
logout, and current-user endpoints.

  5. Organizer dashboard             Build dashboard navigation and
protected pages.

  6. Wedding management              Implement wedding creation and
management.

  7. Question builder                Implement questions, options,
validation, and configuration.

  8. Invitation flow                 Generate unique public wedding
links and QR codes.

  9. Guest joining                   Implement guest participant
creation and wedding-scoped
sessions.

  10. Game controls                  Implement persisted game state and
organizer controls.

  11. Guest gameplay                 Display active questions and accept
validated answers.

  12. Scoring and results            Implement scoring, leaderboard,
results, and winner records.

  13. Real-time experience           Add Socket.IO events, reconnect
handling, and live synchronization.

  14. Platform administration        Add Superadmin tools and
subscription foundations.

  15. Couple memories                Add couple journey media and
related experiences.
16. Release readiness              Test, secure, deploy, rehearse, and
prepare for launch.
MVP priority: Complete the organizer-to-guest game loop first.
Advanced administration, subscriptions, and couple media should not
delay the first working release.
⚙️ Getting started
The repository is being set up. The commands below are a starting point;
update them to match the actual package scripts and folder names as the
project is implemented.
Prerequisites
- Node.js (use the version selected for the project)
- npm, pnpm, or another agreed package manager
- PostgreSQL
- Git
Clone the repository
git clone https://github.com/1978SudipLogan/WedBash.git
cd WedBash
Install dependencies
Run the install command from the relevant application directory once the
frontend and backend packages have been created.
# Example
cd frontend
npm install
# Example
cd backend
npm install
Environment variables
Create local environment files for the frontend and backend. Do not
commit real secrets.

Example backend configuration (replace placeholders with your local
values):
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/wedbash?schema=public"
Example frontend configuration:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
The final variable names and ports should be confirmed in the
application configuration.
Database setup
After Prisma is configured and the initial schema is created, use the
project's package scripts or Prisma CLI commands to generate the client
and apply development migrations.

Do not run production migrations against a development database or
commit database credentials.
🧪 Quality goals
The project should be developed with production reliability in mind:
- Validate API input at system boundaries.
- Test business rules such as guest eligibility, question timing,
  duplicate answers, and scoring.
- Test organizer data isolation and guest session boundaries.
- Handle network interruptions and reconnects during live games.
- Keep API errors consistent and useful.
- Log important organizer and game actions without logging secrets.
- Test the complete flow with multiple guests before using it at a
  real wedding.
🤝 Contributing
This project is currently in early development. Contributions and
suggestions should follow the agreed architecture and coding
conventions.

Suggested workflow:
1. Create a feature branch.
2. Implement the feature within its relevant module.
3. Add or update validation and tests.
4. Run linting, type checks, and tests.
5. Open a pull request with a clear description.
📌 Project principles
- Build the complete core experience before expanding the feature set.
- Keep the architecture simple and modular.
- Enforce authorization and data ownership on the backend.
- Treat the database as the source of truth for game state and scores.
- Keep guest participation frictionless while protecting each
  wedding's data.
- Design for real-world wedding conditions: many guests, mobile
  devices, and unreliable connectivity.
📄 License
A license has not been selected yet. All rights are reserved by the
project owner unless a license is added to this repository.