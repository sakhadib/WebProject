### 3.2 User Profile Management

Description: Comprehensive user profile creation and management functionality.

*Functional Requirements:*

3.2.1 Profile Creation & Editing

* FR-015: Users shall create detailed profiles with bio, avatar, and contact info
* FR-016: Users shall upload and manage profile images
* FR-017: Users shall set privacy preferences for profile visibility
* FR-018: Users shall customize profile themes and display preferences

3.2.2 Profile Viewing

FR-019: System shall display user profiles with articles and activity
FR-020: System shall show follower/following counts and lists
FR-021: System shall display user statistics and achievements

---

A well-structured **profile page** for a blog writing website should balance aesthetics with functionality, offering a clear view of the user's identity, writing, and interactions. Here's a standard yet modern **page structure** that you can customize further based on your goals:

### 🧩 **1. Header / Navbar**

* **Logo / Site Name**
* **Search bar**
* **Navigation links** (Home, Explore, Write, Notifications)
* **User avatar + dropdown** (Settings, Logout)

### 👤 **2. Profile Hero Section**

> Prominently displays user details.

* **Profile Picture**
* **Display Name**
* **@username**
* **Bio** (1–3 lines)
* **Location / Website link / Socials (optional)**
* **Follow / Edit Profile Button** (depending on viewer)
* **Stats**: Posts, Followers, Following, Likes

### 🧭 **3. Tabbed Navigation / Submenu**

> Lets users switch between sections of the profile.

Common tabs:

* 📝 **Posts** — All blogs written
* ❤️ **Liked** — Blogs liked by the user
* 📌 **Bookmarks** — Saved posts (optional)
* 💬 **Comments** — User's comments on posts
* 📄 **About** — Longer personal info, interests, etc.

### 📚 **4. Content Area (Based on Active Tab)**

> Displays actual user content.

#### If on **"Posts"** tab:

* List of blog cards or previews

  * Thumbnail (optional)
  * Title
  * Excerpt / intro
  * Published date
  * Like / Comment / Read more buttons

#### If on **"Liked"** or **"Bookmarks"** tab:

* Similar list layout but styled slightly differently

#### If on **"About"** tab:

* Extended bio
* Interests / skills
* Writing goals or experience

### 🔧 **5. Sidebar (Optional / Responsive Layout)**

Can include:

* **Tags** used frequently by the user
* **Top posts** by user
* **Followers list preview**
* **Reading list suggestions**

### 📱 **6. Mobile Considerations**

* Use a **collapsible tab bar**
* Stack elements vertically
* Replace sidebar with bottom nav or hamburger menu

### 🎨 Design Tips:

* Use clear typography, soft shadows, and consistent padding
* Maintain **card-based layout** for posts for readability
* Animate tab transitions subtly (with fade or slide effects)
* Dark mode toggle (optional but user-friendly)

Would you like a **React layout** example or **wireframe sketch** based on this structure?
