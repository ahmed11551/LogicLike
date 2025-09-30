import React, { useState, useEffect } from 'react';
import { Idea } from './types';
import { apiService } from './services/api';
import IdeaCard from './components/IdeaCard';
import Stats from './components/Stats';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [votingIdeas, setVotingIdeas] = useState<Set<number>>(new Set());

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedIdeas = await apiService.getIdeas();
      setIdeas(fetchedIdeas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки идей');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId: number) => {
    try {
      setVotingIdeas(prev => new Set(prev).add(ideaId));
      setError(null);
      setSuccessMessage(null);

      const updatedIdea = await apiService.voteForIdea(ideaId);
      
      // Update the idea in the list
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => 
          idea.id === ideaId ? updatedIdea : idea
        )
      );

      setSuccessMessage('Ваш голос успешно засчитан!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка голосования';
      setError(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setVotingIdeas(prev => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <h3>Загрузка идей...</h3>
          <p>Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>LogicLike</h1>
        <p>Голосование за идеи развития продукта</p>
        <p>Вы можете проголосовать за максимум 10 идей</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {ideas.length > 0 && <Stats ideas={ideas} />}

      {ideas.length === 0 ? (
        <div className="empty-state">
          <h3>Нет доступных идей</h3>
          <p>Попробуйте обновить страницу</p>
        </div>
      ) : (
        <div className="ideas-grid">
          {ideas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onVote={handleVote}
              isVoting={votingIdeas.has(idea.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
