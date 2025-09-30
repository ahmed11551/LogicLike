import React from 'react';
import { Idea } from '../types';

interface StatsProps {
  ideas: Idea[];
}

const Stats: React.FC<StatsProps> = ({ ideas }) => {
  const totalIdeas = ideas.length;
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
  const votedIdeas = ideas.filter(idea => idea.has_voted).length;
  const topIdea = ideas.reduce((top, idea) => 
    idea.votes > top.votes ? idea : top, ideas[0] || { votes: 0, title: 'Нет идей' }
  );

  return (
    <div className="stats">
      <h3>Статистика голосования</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{totalIdeas}</div>
          <div className="stat-label">Всего идей</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalVotes}</div>
          <div className="stat-label">Всего голосов</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{votedIdeas}</div>
          <div className="stat-label">Ваших голосов</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{topIdea.votes}</div>
          <div className="stat-label">Лидер: {topIdea.title}</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
