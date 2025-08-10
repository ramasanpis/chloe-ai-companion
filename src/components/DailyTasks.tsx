
import React from 'react';
import { CheckCircle, Circle, MessageSquare, Image, Clock } from 'lucide-react';

interface DailyTasksProps {
  messagesSent: number;
}

const DailyTasks: React.FC<DailyTasksProps> = ({ messagesSent }) => {
  const tasks = [
    {
      id: 'messages',
      title: 'Send 5 Messages',
      description: '+5 Favorability',
      progress: Math.min(messagesSent, 5),
      total: 5,
      completed: messagesSent >= 5,
      icon: MessageSquare
    },
    {
      id: 'unlock',
      title: 'Unlock 1 Image',
      description: '+15 Favorability',
      progress: 0, // This would need to be tracked separately
      total: 1,
      completed: false,
      icon: Image
    },
    {
      id: 'session',
      title: 'Chat for 10 minutes',
      description: '+10 Favorability',
      progress: 0, // This would need to be tracked separately
      total: 1,
      completed: false,
      icon: Clock
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Daily Tasks
      </h3>
      
      <div className="space-y-3">
        {tasks.map((task) => {
          const IconComponent = task.icon;
          const progressPercentage = (task.progress / task.total) * 100;
          
          return (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex-shrink-0">
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-white/50" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className="h-4 w-4 text-white/70" />
                  <p className="text-sm font-medium text-white truncate">
                    {task.title}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-green-400">{task.description}</p>
                  <span className="text-xs text-white/70">
                    {task.progress}/{task.total}
                  </span>
                </div>
                
                <div className="mt-2 bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-pink-400 to-purple-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-white/70">
          Complete tasks to boost your relationship! 💕
        </p>
      </div>
    </div>
  );
};

export default DailyTasks;
