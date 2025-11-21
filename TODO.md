# 🧭 Fullstack Blog Project - TODO.md

📅 Start Date: 19 Oct 2025
🎯 Goal: Functional MVP + Deployment (maybe)
💡 Style: Solo dev, modular, testable (if enough coffee)

---

## 1️⃣ Environment Setup - Where the magic begins

- [ ] **Backend setup**
    - [x] Create `server/`
    - [ ] Subfolders: `src/`, `models/`, `controllers/`, `services/`, `utils`, `middlewares`, `routes` for backend
    - [x] Initialize `server/package.json`
        - [x] Install: express, bcrypt, jsonwebtoken, cookie-parser
    - [x] Create `server/src/index.js`
    - [ ] Configure `server/src/routes.js` for basic route structure

- [] **Database setup**
    - [x] Install & run MySQL
    - [x] Connect backend to MySQL
    - [ ] Create route `/db/health` → returns `{ status: "OK", timestamp: ... }` for sanity checks

- [ ] **Frontend setup**
    - [x] Create Vite app: `web/`
    - [x] Install libraries: Zod, TanStack Query, Quill, glin-profanity, TailwindCSS
    - [ ] Configure basic folder structure (`src/components`, `src/hooks`, `src/assets`, `src/utilities`)

- [x] **Proxy setup**
    - [x] Nginx config: forward `/api` to backend, `/` to frontend

- [ ] **Docker setup**
    - [x] `Dockerfile` for backend
    - [x] `Dockerfile` for frontend
    - [x] `docker-compose.yml`
        - [x] Services: backend, frontend, proxy, database
        - [x] Hot reload + logs in terminal
    - [x] Test `docker-compose up` → everything should at least blink green

- [ ] **Cloudinary setup**
    - [ ] Create account, get API keys
    - [ ] Add keys to `.env` (do NOT commit, GitHub is watching 👀)

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

- [ ] **Sequelize associations**
    - [ ] User.hasMany(Article)
    - [ ] Article.belongsTo(User)
    - [ ] Article.hasMany(Comment)
    - [ ] Comment.belongsTo(Article)
    - [ ] Comment.belongsTo(User, allowNull: true)

- [ ] **Zod schemas**
    - [ ] userSchemaRequest,
    - [ ] userSchemaResponse,
    - [ ] articleSchemaRequest,
    - [ ] articleSchemaResponse,
    - [ ] commentSchemaRequest,
    - [ ] commentSchemaResponse,

---

## 3️⃣ Authentication - Gatekeeper of the blog

- [ ] Routes:
    - [ ] `/login` (POST)
    - [ ] `/logout` (POST)
    - [ ] `/api/users` (POST, GET, PUT)
- [ ] authMiddleware
    - [ ] validate JWT, checks role (not needed or now), cookie
- [ ] authControllers
    - [ ] Call authService accordingly, redirect errors with proper codes & success with proper response
- [ ] authServices
    - [ ] login(), logout(), createUser()
- [ ] Extra goodies:
    - [ ] Cookie flags: HttpOnly, Secure, SameSite
    - [ ] Refresh token strategy
    - [ ] Auto-login on page reload

---

## 4️⃣ Articles - The heart of the blog

- [ ] Routes:
    - [ ] `/articles` (POST, GET)
    - [ ] `/articles/:articleId` (GET, PUT, DELETE, PATCH for status change)
- [ ] articleMiddleware
    - [ ] `handleImage` → calls `imageUtils`
    - [ ] validate image type, upload to Cloudinary
- [ ] Utils
    - [ ] `imageUtils.js`: checkImageType(), uploadImage(), deleteImage()
- [ ] articleControllers
    - [ ] Calls articleService, handles error/success responses
- [ ] articleServices
    - [ ] getArticles(), getArticleById(), createArticle(), updateArticleById(), deleteArticleById(), patchArticleById()

- [ ] Notes / bonus:
    - [ ] Status: draft, published, archived, deleted
    - [ ] Only published articles visible publicly

---

## 5️⃣ Comments - Let users shout their opinion (nicely)

- [ ] Routes:
    - [ ] `/articles/:articleId/comments` (GET, POST)
    - [ ] `/articles/:articleId/comments/:commentId` (GET, DELETE)
    - [ ] `/admin/comments/:commentId` (PUT, PATCH, DELETE)
- [ ] Utils/commentUtils:
    - [ ] commentRate, commentDelay (anti-spam)
- [ ] commentMiddleware
    - [ ] calls commentUtils
- [ ] commentControllers
    - [ ] call commentService
    - [ ] handle errors, return proper JSON
- [ ] commentServices
    - [ ] createComment(), getCommentsByArticle(), getCommentById(), updateCommentById(), patchCommentById(), deleteCommentById()

---

## 6️⃣ Frontend Components - Make it look pretty

- [ ] Global:
    - [ ] `<Header />`, `<Footer />`, `<AuthModal />`, `<AdBar />`
- [ ] Articles:
    - [ ] `<ArticleSection />`, `<ArticleList />`, `<ArticleCards />`, `<LatestArticleCard />`
    - [ ] `<ArticleView />` (full content view)
- [ ] Admin:
    - [ ] `<AdminPanel />`, `<AdminArticle />`, `<AdminArticleList />`
    - [ ] CRUD buttons, status toggle, publish/archived/delete actions
- [ ] Comments:
    - [ ] `<CommentSection />`, `<Comment />`
    - [ ] Display by timestamp, nested replies
- [ ] Utilities:
    - [ ] Contexts: AuthContext, ThemeContext (optional)
    - [ ] TanStack Query API: authAPI, articleAPI, commentAPI
- [ ] Frontend extras:
    - [ ] Responsiveness (mobile-first, Figma reference)
    - [ ] Accessibility checks (aria-labels, keyboard nav)
    - [ ] React Error Boundaries

---

## 7️⃣ Testing - Because broken things are sad

- [ ] Backend
    - [ ] Jest + Supertest
    - [ ] Health route tests
    - [ ] Auth tests (login/logout)
    - [ ] Article CRUD tests
    - [ ] Comment CRUD tests
- [ ] Frontend
    - [ ] React Testing Library + Jest
    - [ ] Test components: `<Counter />`, `<ArticleCard />`, `<CommentSection />`
    - [ ] TanStack queries: mock API calls
- [ ] Optional: Cypress / Playwright E2E
    - [ ] Test user flow: login → create article → comment → logout

---

## 8️⃣ Deployment & Docker - Making it alive

- [ ] Dockerfiles: backend & frontend
- [ ] docker-compose.yml with networks, volumes, hot reload
- [ ] Nginx as reverse proxy
- [ ] Environment variables `.env` / `.env.example`
- [ ] Healthchecks for services
- [ ] Seed script: admin user, 2 articles, 3 comments

---

## 9️⃣ Bonus / Polish - Impress the jury

- [ ] Newsletter module (optional)
- [ ] Admin logs page (optional)
- [ ] SEO tags on articles
- [ ] Open Graph metadata for social shares
- [ ] Favicon, icons, assets polished
- [ ] Final user testing with friends (bonus points if you make them laugh)

---

# ⚠️ Notes / Humor Section

- Don't panic if something breaks. That’s why we have backups (and coffee). ☕
- One checkbox at a time. Rome wasn’t coded in a day. 🏛️
- Every TODO checked is a small victory dance 🕺.
- Commit often, commit small. Your future self will thank you.

---
