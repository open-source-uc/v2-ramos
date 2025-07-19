import { useEffect, useState } from 'react';
import { VoteArrow } from '../icons/icons';

export default function VoteButtons({ 
  initialVotes = 0, 
  reviewId,
}: {
  initialVotes?: number;
  reviewId: string | number;
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const redirectToLogin = () => {
    const currentUrl = window.location.href;
    window.location.href = `https://auth.osuc.dev?ref=${encodeURIComponent(currentUrl)}`;
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      let newVotes = votes;
      let newUserVote: 'up' | 'down' | null = voteType;

      if (userVote === voteType) {
        newVotes = votes + (voteType === 'up' ? -1 : 1);
        newUserVote = null;

        const res = await fetch('/api/likes', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ review_id: reviewId }),
        });

        if (res.status === 401) return redirectToLogin();
      } else {
        if (userVote && userVote !== voteType) {
          newVotes = votes + (voteType === 'up' ? 2 : -2);
        } else {
          newVotes = votes + (voteType === 'up' ? 1 : -1);
        }

        const res = await fetch('/api/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: voteType === 'up' ? 'like' : 'dislike',
            review_id: reviewId,
          }),
        });

        if (res.status === 401) return redirectToLogin();
      }

      setVotes(newVotes);
      setUserVote(newUserVote);

    } catch (error) {
      console.error('Error al votar:', error);
    }
  };

  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const response = await fetch(`/api/likes?review_id=${reviewId}`);
        if (!response.ok) throw new Error('Error al obtener el voto del usuario');
        
        const data: { vote: 'up' | 'down' | null } = await response.json();
        setUserVote(data.vote);
      } catch (error) {
        console.error('Error al cargar el voto del usuario:', error);
      }
    };

    fetchUserVote();
  }, []);

  const getVoteCountColor = () => {
    if (votes > 0) return 'text-green';
    if (votes < 0) return 'text-red';
    return 'text-muted-foreground';
  };

  return (
    <div className="absolute top-3 right-3 flex flex-col items-center bg-card/90 rounded-lg p-1 backdrop-blur-sm shadow-sm border border-border">
      <button 
        className={`p-1.5 rounded-md transition-all duration-150 hover:bg-muted ${
          userVote === 'up' 
            ? 'text-green bg-green-light' 
            : 'text-muted-foreground hover:text-green'
        }`}
        onClick={() => handleVote('up')}
        title="Upvote"
      >
        <VoteArrow direction="up" className="w-4 h-4 transition-colors" />
      </button>

      <span className={`text-xs font-semibold px-1 py-0.5 min-w-[24px] text-center transition-colors ${getVoteCountColor()}`}>
        {votes > 0 ? `+${votes}` : votes}
      </span>

      <button 
        className={`p-1.5 rounded-md transition-all duration-150 hover:bg-muted ${
          userVote === 'down' 
            ? 'text-red bg-red-light' 
            : 'text-muted-foreground hover:text-red'
        }`}
        onClick={() => handleVote('down')}
        title="Downvote"
      >
        <VoteArrow direction="down" className="w-4 h-4 transition-colors" />
      </button>
    </div>
  );
}
