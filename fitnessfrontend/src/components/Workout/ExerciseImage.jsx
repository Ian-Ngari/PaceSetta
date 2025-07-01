
import { useState } from 'react';

const ExerciseImage = ({ exercise }) => {
  const [currentImage, setCurrentImage] = useState(
    exercise.gifUrl || `/exercise-placeholder.png`
  );

  const handleError = () => {
    setCurrentImage('/exercise-placeholder.png');
  };

  return (
    <div className="mt-3">
      <img 
        src={currentImage} 
        alt={exercise.name}
        className="w-full h-48 object-cover rounded-lg"
        onError={handleError}
      />
    </div>
  );
};

export default ExerciseImage;