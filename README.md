# My Node.js REST API Project

REST APIs for a Product Catalog Import & Validation Platform.The platform allows merchants to upload product catalog files, validate the catalog
asynchronously, and review validation issues.

## 🚀 Technologies Used
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## 📥 Installation & Setup

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Refer .env-example file to setup environment file.

4. **Run the application:**
   - For development (with hot-reloading):
     ```bash
     npm run dev
     
## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - Registers a new user.
- `POST /api/auth/login` - Authenticates a user and returns a token.

### Tasks (Protected - Requires Bearer Token)
- `GET /api/imports` - import CSV file.
- `GET /api/imports/:importid` - import CSV file with Id.
- `POST /api/imports/:id/validate` - import validation API.
