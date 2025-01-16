import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import { users, type User } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);

// Define a custom User type for Express that extends our schema User type
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      username: string;
    }
  }
}

export async function setupAuth(app: Express) {
  // Session setup
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: app.get("env") === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email: string, password: string, done) => {
      try {
        console.log('Attempting login with email:', email);
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          console.log('User not found with email:', email);
          return done(null, false, { message: "Incorrect email." });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.log('Invalid password for user:', email);
          return done(null, false, { message: "Incorrect password." });
        }

        console.log('Login successful for user:', email);
        return done(null, {
          id: user.id,
          email: user.email,
          username: user.username
        });
      } catch (err) {
        console.error('Login error:', err);
        return done(err);
      }
    }
  ));

  passport.serializeUser((user: Express.User, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log('Deserializing user:', id);
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          username: users.username
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        return done(new Error('User not found'), null);
      }

      done(null, user);
    } catch (err) {
      console.error('Deserialization error:', err);
      done(err, null);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      console.log('Registration request:', req.body);
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        console.error('Validation failed:', result.error.issues);
        return res.status(400).json({
          error: "Validation failed",
          details: result.error.issues
        });
      }

      const { email, password, username } = result.data;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        console.log('Email already registered:', email);
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          username,
          password: hashedPassword
        })
        .returning();

      console.log('User created:', newUser.id);

      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      };

      // Log the user in
      req.login(userResponse, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ error: "Error logging in after registration" });
        }
        return res.json({
          message: "Registration successful",
          user: userResponse
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log('Login request:', req.body);
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log('Authentication failed:', info.message);
        return res.status(401).json({ error: info.message || "Authentication failed" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          return next(err);
        }
        console.log('Login successful for user:', user.id);
        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    const userId = req.user?.id;
    console.log('Logout request for user:', userId);
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: "Error logging out" });
      }
      console.log('Logout successful for user:', userId);
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as Express.User;
      console.log('Current user:', user.id);
      return res.json({
        id: user.id,
        email: user.email,
        username: user.username
      });
    }
    console.log('No authenticated user');
    res.status(401).json({ error: "Not authenticated" });
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}