import React from 'react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onVote: (ideaId: number) => Promise<void>;
  isVoting: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onVote, isVoting }) => {
  const handleVote = async () => {
    if (!isVoting && !idea.has_voted) {
      await onVote(idea.id);
    }
  };

  const getVoteButtonText = () => {
    if (isVoting) return 'Голосую...';
    if (idea.has_voted) return '✓ Проголосовано';
    return 'Проголосовать';
  };

  const getVoteButtonClass = () => {
    let className = 'vote-button';
    if (idea.has_voted) className += ' voted';
    if (isVoting) className += ' loading';
    return className;
  };

  return (
    <div className="idea-card">
      <h3 className="idea-title">{idea.title}</h3>
      {idea.description && (
        <p className="idea-description">{idea.description}</p>
      )}
      <div className="idea-footer">
        <div className="vote-count">
          <span className="icon">👍</span>
          <span>{idea.votes} голосов</span>
        </div>
        <button
          className={getVoteButtonClass()}
          onClick={handleVote}
          disabled={idea.has_voted || isVoting}
        >
          {isVoting && <span className="loading-spinner"></span>}
          {getVoteButtonText()}
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
