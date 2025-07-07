import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaPlus, FaFilePdf, FaCheck, FaDumbbell } from 'react-icons/fa';
import jsPDF from 'jspdf';
import ExerciseImage from './ExerciseImage'; 

const WorkoutPlan = ({ plan, onEdit, onNewPlan }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.text(plan.name, 105, 15, null, null, 'center');
    
    // Plan details
    doc.setFontSize(12);
    doc.text(`Goal: ${plan.goal}`, 20, 25);
    doc.text(`Level: ${plan.level}`, 20, 32);
    
    let yPosition = 45;
    
    // Routines
    plan.routines.forEach(routine => {
      doc.setFontSize(16);
      doc.text(routine.day, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      routine.exercises.forEach(exercise => {
        // Exercise name
        doc.text(`• ${exercise.name}`, 25, yPosition);
        yPosition += 7;
        
        // Exercise details
        doc.setFontSize(10);
        doc.text(`Sets: ${exercise.sets} | Reps: ${exercise.reps}`, 30, yPosition);
        yPosition += 7;
        
        // Exercise metadata
        doc.text(`Body Part: ${exercise.bodyPart} | Target: ${exercise.target}`, 30, yPosition);
        yPosition += 7;
        
        yPosition += 3; // Spacing
      });
      
      yPosition += 10; // Spacing between routines
      
      // Page break if needed
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    doc.save('workout-plan.pdf');
  };

  return (
    <div className="bg-gray-950 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm">
                Goal: {plan.goal}
              </span>
              <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm">
                Level: {plan.level}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <FaEdit className="mr-2" /> Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewPlan}
              className="flex items-center px-4 py-2 bg-gray-950 hover:bg-gray-600 text-white rounded-lg"
            >
              <FaPlus className="mr-2" /> New Plan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              <FaFilePdf className="mr-2" /> Export
            </motion.button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plan.routines.map((routine, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700/50 rounded-lg p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-900/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{routine.day}</h3>
              </div>
              
              <ul className="space-y-3">
                {routine.exercises.map((exercise, exIndex) => (
                  <motion.li 
                    key={exIndex}
                    whileHover={{ x: 5 }}
                    className="bg-gray-800 p-4 rounded-lg"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-900/20 p-2 rounded-lg mr-3 flex-shrink-0">
                        <FaDumbbell className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{exercise.name}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                            {exercise.sets} sets
                          </span>
                          <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs">
                            {exercise.reps} reps
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          <p>Body Part: {exercise.bodyPart}</p>
                          <p>Target: {exercise.target}</p>
                          <p>Equipment: {exercise.equipment}</p>
                        </div>
                      </div>
                      <div className="ml-2 p-1 text-green-400">
                        <FaCheck />
                      </div>
                    </div>
                    
    {exercise.gifUrl && (
  <ExerciseImage exercise={exercise} />
)}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;