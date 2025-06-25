export function calculateSentiment(likes: number, superlikes: number, dislikes: number): 'veryHappy' | 'happy' | 'neutral' | 'sad' | 'verySad' | 'question' {
  const total = likes + superlikes + dislikes;
  
  if (total === 0) {
    return 'question';
  }
  
  const positivePercentage = ((likes + superlikes * 2) / (total + superlikes)) * 100;
  
  if (positivePercentage >= 80) return 'veryHappy';
  if (positivePercentage >= 60 && positivePercentage < 80) return 'happy';
  if (positivePercentage >= 40 && positivePercentage < 60) return 'neutral';
  if (positivePercentage >= 20 && positivePercentage < 40) return 'sad';
  if (positivePercentage < 20) return 'verySad';

  return 'neutral';
}

export function calculatePositivePercentage(likes: number, superlikes: number, dislikes: number): number {
  const total = likes + 2*superlikes + dislikes;
  if (total === 0) return 0;
  
  return Math.round(((likes + 2*superlikes) / total) * 100);
}

export function getWorkloadLabel(votes_low: number, votes_medium: number, votes_high: number): string {
  const total = votes_low + votes_medium + votes_high;
  if (total === 0) return "Sin datos";
  
  const maxVotes = Math.max(votes_low, votes_medium, votes_high);
  
  if (maxVotes === votes_low) return "Baja";
  if (maxVotes === votes_medium) return "Media";
  return "Alta";
}

export function getAttendanceLabel(mandatory: number, optional: number, none: number): string {
  const total = mandatory + optional + none;
  if (total === 0) return "Sin datos";
  
  const maxVotes = Math.max(mandatory, optional, none);
  
  if (maxVotes === mandatory) return "Obligatoria";
  if (maxVotes === optional) return "Opcional";
  return "No requiere";
}

export function formatWeeklyHours(hours: number): string {
  if (hours === 0) return "Sin datos";
  if (hours < 1) return "< 1 hora";
  if (hours === 1) return "1 hora";
  return `${Math.round(hours)} horas`;
}

export function getSentimentLabel(sentiment: string): string {
  const labels = {
    veryHappy: "Sumamente positivas",
    happy: "Positivas", 
    neutral: "Mixtas",
    sad: "Negativas",
    verySad: "Sumamente negativas",
    question: "Sin reseñas"
  };
  return labels[sentiment as keyof typeof labels] || "Sin datos";
}
