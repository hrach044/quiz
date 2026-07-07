import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import fs from "fs";
import path from "path";
import crypto from "crypto";
import pg from "pg";
import { User, CareerResult } from "../types";

const { Pool } = pg;

// Local JSON file config
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DbSchema {
  users: Array<User & { passwordHash: string }>;
  results: Record<string, CareerResult>;
}

// Lazy load connection pool to avoid startup crashes if connection is slow
let pool: pg.Pool | null = null;

export function getIsPostgres(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://");
}

export function getPool(): pg.Pool | null {
  if (!getIsPostgres()) return null;
  if (!pool) {
    console.log("Initializing Supabase/PostgreSQL Connection Pool...");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase/Render/Railway connections
      },
      // Force IPv4 resolution to prevent ENETUNREACH errors on Render/Supabase (which has IPv6 records)
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { ...options, family: 4 }, callback);
      },
    } as any);
  }
  return pool;
}

// Initialize Local database if fallback is active
function initLocalDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData: DbSchema = {
      users: [],
      results: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

function readLocalDb(): DbSchema {
  initLocalDb();
  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read local DB, returning default schema:", error);
    return { users: [], results: {} };
  }
}

function writeLocalDb(data: DbSchema) {
  initLocalDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Hash password helper (SHA256)
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Initialize tables if PostgreSQL is active
export async function initDatabase(): Promise<void> {
  if (!getIsPostgres()) {
    console.log("Database Mode: Using Local File Database (data/db.json).");
    initLocalDb();
    return;
  }

  console.log("Database Mode: Supabase/PostgreSQL is configured.");
  const dbPool = getPool();
  if (!dbPool) return;

  try {
    // 1. Create users table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create quiz_results table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scores JSONB NOT NULL,
        primary_category VARCHAR(100) NOT NULL,
        ai_explanation TEXT NOT NULL,
        recommendations JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Supabase database tables verified/created successfully.");
  } catch (error) {
    console.error("Failed to verify/create database tables in Supabase:", error);
    // Do not crash the app, but log clearly
  }
}

// Database Operations

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const normEmail = email.toLowerCase().trim();

  if (getIsPostgres()) {
    const dbPool = getPool();
    if (dbPool) {
      const res = await dbPool.query("SELECT * FROM users WHERE LOWER(email) = $1", [normEmail]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          passwordHash: row.password_hash,
        };
      }
    }
    return null;
  } else {
    const db = readLocalDb();
    const found = db.users.find((u) => u.email.toLowerCase() === normEmail);
    return found || null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  if (getIsPostgres()) {
    const dbPool = getPool();
    if (dbPool) {
      const res = await dbPool.query("SELECT * FROM users WHERE id = $1", [id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
        };
      }
    }
    return null;
  } else {
    const db = readLocalDb();
    const found = db.users.find((u) => u.id === id);
    if (found) {
      return { id: found.id, email: found.email };
    }
    return null;
  }
}

export async function createUser(id: string, email: string, passwordHash: string): Promise<User> {
  const normEmail = email.toLowerCase().trim();

  if (getIsPostgres()) {
    const dbPool = getPool();
    if (!dbPool) throw new Error("Database pool is not initialized");
    await dbPool.query(
      "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)",
      [id, normEmail, passwordHash]
    );
    return { id, email: normEmail };
  } else {
    const db = readLocalDb();
    const newUser = { id, email: normEmail, passwordHash };
    db.users.push(newUser);
    writeLocalDb(db);
    return { id, email: normEmail };
  }
}

export async function getQuizResult(userId: string): Promise<CareerResult | null> {
  if (getIsPostgres()) {
    const dbPool = getPool();
    if (dbPool) {
      const res = await dbPool.query("SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          userId: row.user_id,
          scores: row.scores,
          primaryCategory: row.primary_category,
          aiExplanation: row.ai_explanation,
          recommendations: row.recommendations,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        };
      }
    }
    return null;
  } else {
    const db = readLocalDb();
    return db.results[userId] || null;
  }
}

export async function saveQuizResult(userId: string, result: CareerResult): Promise<void> {
  if (getIsPostgres()) {
    const dbPool = getPool();
    if (!dbPool) throw new Error("Database pool is not initialized");

    // Check if result already exists to perform upsert or delete + insert
    await dbPool.query("DELETE FROM quiz_results WHERE user_id = $1", [userId]);
    await dbPool.query(
      `INSERT INTO quiz_results (user_id, scores, primary_category, ai_explanation, recommendations)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        JSON.stringify(result.scores),
        result.primaryCategory,
        result.aiExplanation,
        JSON.stringify(result.recommendations),
      ]
    );
  } else {
    const db = readLocalDb();
    db.results[userId] = result;
    writeLocalDb(db);
  }
}

export async function deleteQuizResult(userId: string): Promise<void> {
  if (getIsPostgres()) {
    const dbPool = getPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM quiz_results WHERE user_id = $1", [userId]);
    }
  } else {
    const db = readLocalDb();
    delete db.results[userId];
    writeLocalDb(db);
  }
}

// Deprecated legacy synchronous signatures kept for safety/compatibility (return empty/local data)
export function readDb(): DbSchema {
  return readLocalDb();
}
export function writeDb(data: DbSchema) {
  writeLocalDb(data);
}
