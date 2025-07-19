import { useEffect, useState } from 'react';
import { VoteArrow } from '../icons/icons';


// Componente principal de votación
export default function VoteButtons({ 
  initialVotes = 0, 
  reviewId,
}: {
  initialVotes?: number;
  reviewId: string | number;
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      let newVotes = votes;
      let newUserVote: 'up' | 'down' | null = voteType;

      // Si ya votó lo mismo, remover voto
      if (userVote === voteType) {
        newVotes = votes + (voteType === 'up' ? -1 : 1);
        newUserVote = null;
        
        // DELETE request para remover el voto
        await fetch('/api/likes', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            review_id: reviewId,
          }),
        });
      }
      // Si cambió de voto o es primer voto
      else {
        if (userVote && userVote !== voteType) {
          // Cambió de voto
          newVotes = votes + (voteType === 'up' ? 2 : -2);
        } else {
          // Primer voto
          newVotes = votes + (voteType === 'up' ? 1 : -1);
        }

        // POST request para agregar/cambiar el voto
        await fetch('/api/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: voteType === 'up' ? 'like' : 'dislike',
            review_id: reviewId,
          }),
        });
      }
      
      setVotes(newVotes);
      setUserVote(newUserVote);
      
    } catch (error) {
      console.error('Error al votar:', error);
      // Aquí podrías mostrar un toast de error
      // Revertir el estado en caso de error
      // setVotes(votes);
      // setUserVote(userVote);
    }
  };

	useEffect(() => {
		const fetchUserVote = async () => {
			try {
				const response = await fetch(`/api/likes?review_id=${reviewId}`);
				if (!response.ok) throw new Error('Error al obtener el voto del usuario');
				
				const data: {
					vote: 'up' | 'down' | null;
				} = await response.json();
				setUserVote(data.vote);
			} catch (error) {
				console.error('Error al cargar el voto del usuario:', error);
			}
		};

		fetchUserVote();
	}, [])

  // Determinar color del contador basado en el valor
  const getVoteCountColor = () => {
    if (votes > 0) return 'text-green';
    if (votes < 0) return 'text-red';
    return 'text-muted-foreground';
  };

  return (
    <div className="absolute top-3 right-3 flex flex-col items-center bg-card/90 rounded-lg p-1 backdrop-blur-sm shadow-sm border border-border">
      {/* Botón upvote */}
      <button 
        className={`p-1.5 rounded-md transition-all duration-150 hover:bg-muted ${
          userVote === 'up' 
            ? 'text-green bg-green-light' 
            : 'text-muted-foreground hover:text-green'
        }`}
        onClick={() => handleVote('up')}
        title="Upvote"
      >
        <VoteArrow 
          direction="up" 
          className="w-4 h-4 transition-colors" 
        />
      </button>
      
      {/* Contador de votos */}
      <span className={`text-xs font-semibold px-1 py-0.5 min-w-[24px] text-center transition-colors ${getVoteCountColor()}`}>
        {votes > 0 ? `+${votes}` : votes}
      </span>
      
      {/* Botón downvote */}
      <button 
        className={`p-1.5 rounded-md transition-all duration-150 hover:bg-muted ${
          userVote === 'down' 
            ? 'text-red bg-red-light' 
            : 'text-muted-foreground hover:text-red'
        }`}
        onClick={() => handleVote('down')}
        title="Downvote"
      >
        <VoteArrow 
          direction="down" 
          className="w-4 h-4 transition-colors" 
        />
      </button>
    </div>
  );
}