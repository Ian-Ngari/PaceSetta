import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

const WorkoutPlan = ({ plan, onEdit, onNewPlan }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(plan.name || 'Workout Plan', 10, 15);
    doc.setFontSize(12);
    doc.text(`Goal: ${plan.goal}`, 10, 25);
    doc.text(`Level: ${plan.level}`, 10, 32);

    let y = 42;
    plan.routines.forEach((routine, idx) => {
      doc.setFontSize(14);
      doc.text(`${routine.day}`, 10, y);
      y += 7;
      routine.exercises.forEach((ex, i) => {
        doc.setFontSize(12);
        doc.text(
          `- ${ex.name}: ${ex.sets} sets x ${ex.reps} reps${ex.weight ? ` @ ${ex.weight} kg` : ''}`,
          14,
          y
        );
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      y += 4;
    });

    doc.save('workout-plan.pdf');
  };
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
            <p className="text-gray-600">
              Goal: <span className="font-medium">{plan.goal}</span> | 
              Level: <span className="font-medium">{plan.level}</span>
            </p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewPlan}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              New Plan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
               onClick={exportToPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
              Export
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
              className="border rounded-lg p-4 bg-gray-50"
            >
              <h3 className="text-xl font-semibold mb-4">{routine.day}</h3>
              <ul className="space-y-3">
                {routine.exercises.map((exercise, exIndex) => (
                  <motion.li 
                    key={exIndex}
                    whileHover={{ x: 5 }}
                    className="flex justify-between items-center p-2 bg-white rounded shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-gray-500">{exercise.notes}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {exercise.sets}x{exercise.reps}
                    </span>
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