import express from 'express';
import { pool } from '../server';
import { getClientIP } from '../utils/database';
import { Idea } from '../models/Idea';

const router = express.Router();

// Get all ideas with vote counts, sorted by votes
router.get('/', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    
    const result = await pool.query(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.votes,
        i.created_at,
        CASE WHEN v.id IS NOT NULL THEN true ELSE false END as has_voted
      FROM ideas i
      LEFT JOIN votes v ON i.id = v.idea_id AND v.ip_address = $1
      ORDER BY i.votes DESC, i.created_at ASC
    `, [clientIP]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Vote for an idea
router.post('/:id/vote', async (req, res) => {
  const ideaId = parseInt(req.params.id);
  const clientIP = getClientIP(req);

  if (isNaN(ideaId)) {
    return res.status(400).json({ error: 'Invalid idea ID' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check if idea exists
    const ideaResult = await client.query('SELECT id FROM ideas WHERE id = $1', [ideaId]);
    if (ideaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Check if user already voted for this idea
    const existingVote = await client.query(
      'SELECT id FROM votes WHERE idea_id = $1 AND ip_address = $2',
      [ideaId, clientIP]
    );

    if (existingVote.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'You have already voted for this idea' });
    }

    // Check IP vote limit (max 10 votes per IP)
    const voteCountResult = await client.query(
      'SELECT COUNT(*) as count FROM votes WHERE ip_address = $1',
      [clientIP]
    );
    
    const voteCount = parseInt(voteCountResult.rows[0].count);
    if (voteCount >= 10) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        error: 'Vote limit exceeded. You can vote for maximum 10 ideas.' 
      });
    }

    // Add vote
    await client.query(
      'INSERT INTO votes (idea_id, ip_address) VALUES ($1, $2)',
      [ideaId, clientIP]
    );

    // Update vote count
    await client.query(
      'UPDATE ideas SET votes = votes + 1 WHERE id = $1',
      [ideaId]
    );

    await client.query('COMMIT');

    // Return updated idea data
    const updatedIdea = await client.query(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.votes,
        i.created_at,
        true as has_voted
      FROM ideas i
      WHERE i.id = $1
    `, [ideaId]);

    res.json(updatedIdea.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error voting for idea:', error);
    res.status(500).json({ error: 'Failed to vote for idea' });
  } finally {
    client.release();
  }
});

// Get vote statistics for an IP
router.get('/stats/:ip', async (req, res) => {
  try {
    const ip = req.params.ip;
    
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_votes,
        COUNT(DISTINCT idea_id) as unique_ideas_voted
      FROM votes 
      WHERE ip_address = $1
    `, [ip]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching vote stats:', error);
    res.status(500).json({ error: 'Failed to fetch vote statistics' });
  }
});

export default router;
