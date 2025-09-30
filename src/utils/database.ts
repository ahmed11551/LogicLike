import { pool } from '../server';

export const initDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  
  try {
    // Create ideas table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create votes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
        ip_address INET NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, ip_address)
      )
    `);

    // Create index for faster IP lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON votes(ip_address)
    `);

    // Create index for faster idea lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_votes_idea_id ON votes(idea_id)
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getClientIP = (req: any): string => {
  // Check for X-Forwarded-For header (for reverse proxy)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  // Check for X-Real-IP header
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }
  
  // Fallback to connection remote address
  return req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
};
