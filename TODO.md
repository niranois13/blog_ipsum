# 🧭 Fullstack Blog Project - TODO.md

📅 Start Date: 19 Oct 2025
🎯 Goal: Functional MVP + Deployment (maybe)
💡 Style: Solo dev, modular, testable (if enough coffee)

---

## 1️⃣ Environment Setup - Where the magic begins

- [x] **Backend setup**
    - [x] Create `server/`
    - [x] Subfolders: `src/`, `models/`, `controllers/`, `services/`, `utils`, `middlewares`, `routes` for backend
    - [x] Initialize `server/package.json`
        - [x] Install: express, bcrypt, jsonwebtoken, cookie-parser
    - [x] Create `server/src/index.js`
    - [x] Configure `server/src/routes.js` for basic route structure

- [x] **Database setup**
    - [x] Install & run MySQL
    - [x] Connect backend to MySQL

- [x] **Frontend setup**
    - [x] Create Vite app: `web/`
    - [x] Install libraries: Zod, TanStack Query, Quill, glin-profanity, TailwindCSS
    - [x] Configure basic folder structure (`src/components`, `src/hooks`, `src/assets`, `src/utilities`)

- [x] **Proxy setup**
    - [x] Nginx config: forward `/api` to backend, `/` to frontend

- [ ] **Docker setup**
    - [x] `Dockerfile` for backend
    - [x] `Dockerfile` for frontend
    - [x] `docker-compose.yml`
        - [x] Services: backend, frontend, proxy, database
        - [x] Hot reload + logs in terminal
    - [x] Test `docker-compose up` → everything should at least blink green

- [x] **Cloudinary setup**
    - [x] Create account, get API keys
    - [x] Add keys to `.env`

---

## 2️⃣ Models - Where your data lives

=> cf UML Class Diagramm

- [x] **BaseModel** (id, createdAt, updatedAt => all private)
- [x] **User**
    - [x] username, email, password, role
- [x] **Article**
    - [x] title, summary, content (JSON stringified), image (cloudinary URL), status
- [x] **Comment**
    - [x] text, userId (nullable), articleId

- [x] **Sequelize associations**
    - [x] User.hasMany(Article)
    - [x] Article.belongsTo(User)
    - [x] Article.hasMany(Comment)
    - [x] Comment.belongsTo(Article)
    - [x] Comment.belongsTo(User, allowNull: true)

- [ ] **Zod schemas**
    - [ ] userSchemaRequest,
    - [ ] userSchemaResponse,
    - [ ] articleSchemaRequest,
    - [ ] articleSchemaResponse,
    - [ ] commentSchemaRequest,
    - [ ] commentSchemaResponse,

---

## 3️⃣ Authentication - Gatekeeper of the blog

- [x] Routes:
    - [x] `/login` (POST)
    - [x] `/logout` (POST)
    - [x] `/api/users` (POST, GET, PUT)
- [x] authMiddleware
    - [x] validate JWT, checks role, cookie
- [x] authControllers
    - [x] Call authService accordingly, redirect errors with proper codes & success with proper response
- [x] authServices
    - [x] login(), logout(), createUser()
- [ ] Extra goodies:
    - [ ] Cookie flags: HttpOnly, Secure, SameSite
    - [ ] Refresh token strategy
    - [ ] Auto-login on page reload

---

## 4️⃣ Articles - The heart of the blog

- [x] Routes:
    - [x] `/articles` (POST, GET)
    - [x] `/articles/:articleId` (GET, PUT, DELETE, PATCH for status change)
- [x] articleMiddleware
    - [x] `handleImage` → calls `imageUtils`
    - [x] validate image type, upload to Cloudinary
- [x] Utils
    - [x] `imageUtils.js`: checkImageType(), uploadImage(), deleteImage()
- [x] articleControllers
    - [x] Calls articleService, handles error/success responses
- [x] articleServices
    - [x] getArticles(), getArticleById(), createArticle(), updateArticleById(), deleteArticleById(), patchArticleById()

- [x] Notes / bonus:
    - [x] Status: draft, published, archived, deleted
    - [x] Only published articles visible publicly

---

## 5️⃣ Comments - Let users shout their opinion (nicely)

- [x] Routes:
    - [x] `/articles/:articleId/comments` (GET, POST)
    - [x] `/articles/:articleId/comments/:commentId` (GET, DELETE)
    - [x] `/admin/comments/:commentId` (PUT, PATCH, DELETE)
- [x] Utils/commentUtils:
    - [x] commentRate, commentDelay (anti-spam)
- [x] commentMiddleware
    - [x] calls commentUtils
- [x] commentControllers
    - [x] call commentService
    - [x] handle errors, return proper JSON
- [x] commentServices
    - [x] createComment(), getCommentsByArticle(), getCommentById(), updateCommentById(), patchCommentById(), deleteCommentById()

---

## 6️⃣ Frontend Components - Make it look pretty

- [x] Global:
    - [x] `<Header />`, `<Footer />`, `<AuthModal />`, `<AdBar />`
- [x] Articles:
    - [x] `<ArticleSection />`, `<ArticleList />`, `<ArticleCards />`, `<LatestArticleCard />`
    - [x] `<ArticleView />` (full content view)
- [x] Admin:
    - [x] `<AdminPanel />`, `<AdminArticle />`, `<AdminArticleList />`
    - [x] CRUD buttons, status toggle, publish/archived/delete actions
- [x] Comments:
    - [x] `<CommentSection />`, `<Comment />`
    - [x] Display by timestamp, nested replies
- [x] Utilities:
    - [x] Contexts: AuthContext, ThemeContext (optional)
    - [x] TanStack Query API: authAPI, articleAPI, commentAPI
- [ ] Frontend extras:
    - [x] Responsiveness (mobile-first, Figma reference)
    - [x] Accessibility checks (aria-labels, keyboard nav)
    - [ ] React Error Boundaries

---

## 7️⃣ Testing - Because broken things are sad

- [x] Backend
    - [x] Vitest + Supertest
    - [x] Health route tests
    - [x] Auth tests (login/logout)
    - [x] Article CRUD tests
    - [x] Comment CRUD tests
- [ ] Frontend
    - [ ] React Testing Library + Vitest
    - [ ] Test components
    - [ ] TanStack queries: mock API calls
- [ ] Cypress / Playwright E2E
    - [ ] Test user flow: login → create article → comment → logout

---

## 8️⃣ Deployment & Docker - Making it alive

- [x] Dockerfiles: backend & frontend
- [x] docker-compose.yml with networks, volumes, hot reload
- [x] Nginx as reverse proxy
- [x] Environment variables `.env` / `.env.example`
- [x] Healthchecks for services
- [ ] Seed script: admin user, 2 articles, 3 comments

---

## 9️⃣ Bonus / Polish

- [ ] Newsletter module (optional)
- [ ] Admin logs page (optional)
- [ ] SEO tags on articles
- [ ] Open Graph metadata for social shares
- [ ] Favicon, icons, assets polished

---

