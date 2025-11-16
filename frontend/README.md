# Movie App Frontend

This is the frontend application for the TCSS 460 Movie Dataset project, built with Next.js 15 and TypeScript.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

4. Update the environment variables in `.env.local`:
   - Generate a secure `NEXTAUTH_SECRET_KEY`: 
     ```bash
     openssl rand -base64 32
     ```
   - Set `NEXTAUTH_URL` to your deployment URL (use `http://localhost:3000` for local development)

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── register/          # User registration page
│   │   ├── login/             # User login page
│   │   ├── change-password/   # Password reset page
│   │   └── api/auth/          # NextAuth API routes
│   ├── services/              # API service layer
│   │   └── credentialsApi.ts  # Credentials API integration
│   ├── utils/                 # Utility functions
│   │   ├── authOptions.tsx    # NextAuth configuration
│   │   └── validation.ts      # Form validation schemas
│   └── types/                 # TypeScript type definitions
│       └── auth.ts            # Authentication types
├── public/                    # Static assets
└── package.json

```

## Authentication

This app integrates with the Group 5 Credentials API for user authentication.

### Features

- **User Registration** (`/register`)
  - Email validation
  - Username validation (3-20 characters, alphanumeric + underscores)
  - Password strength requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
  - Real-time client-side validation
  - Password strength indicator

- **User Login** (`/login`)
  - Login with email or username
  - NextAuth session management
  - Automatic redirection after login

- **Password Recovery** (`/change-password`)
  - Email or username based recovery

### API Integration

The app connects to:
- **Credentials API**: `https://tcss460-group5-credentials-api.onrender.com`
- **Movies API**: `https://tcss460-moviewebapi.onrender.com`
- **TV Shows API**: `https://group3-datasetwebapi.onrender.com`

### Validation Rules

Client-side validation matches server-side requirements:

- **Email**: Standard email format
- **Username**: 3-20 characters, must start with letter, alphanumeric + underscores only
- **Password**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **First/Last Name**: Optional, letters and spaces only, max 50 characters

## Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run prettier` - Format code with Prettier

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **NextAuth** - Authentication
- **Formik** - Form management
- **Yup** - Schema validation
- **Axios** - HTTP client
- **Material-UI** - UI components

## Team

**Group 2 - TCSS 460**

- Primitivo Bambao - UI/UX Design, Frontend Development
- Jakita Kaur - API Integration, Testing
- Evan Tran - Feature Development
- George Njane - Backend Integration

## License

This project is for educational purposes as part of TCSS 460.
