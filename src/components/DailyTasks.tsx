
import React from 'react';
import { CheckCircle, Circle, MessageCircle, Image, Coffee } from 'lucide-react';

interface DailyTasksProps {
  messagesSent: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  reward: string;
}

const DailyTasks: React.FC<DailyTasksProps> = ({ messagesSent }) => {
  const tasks: Task[] = [
    {
      id: 'messages',
      title: 'Send 3 Messages',
      description: 'Chat with your companion',
      completed: messagesSent >= 3,
      icon: <MessageCircle className="h-4 w-4" />,
      reward: '+5 points'
    },
    {
      id: 'image',
      title: 'Unlock an Image',
      description: 'Watch an ad to unlock content',
      completed: false, // This would be tracked in real implementation
      icon: <Image className="h-4 w-4" />,
      reward: '+10 points'
    },
    {
      id: 'session',
      title: 'Chat for 5 minutes',
      description: 'Have a meaningful conversation',
      completed: false, // This would be tracked in real implementation
      icon: <Coffee className="h-4 w-4" />,
      reward: '+3 points'
    }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Daily Tasks</h3>
        <span className="text-purple-200 text-sm">{completedTasks}/{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              task.completed 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div className={`mt-0.5 ${task.completed ? 'text-green-400' : 'text-purple-300'}`}>
              {task.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={task.completed ? 'text-green-400' : 'text-purple-300'}>
                  {task.icon}
                </div>
                <h4 className={`font-medium text-sm ${task.completed ? 'text-green-300' : 'text-white'}`}>
                  {task.title}
                </h4>
              </div>
              <p className="text-purple-200 text-xs">{task.description}</p>
              <span className="text-pink-300 text-xs font-medium">{task.reward}</span>
            </div>
          </div>
        ))}
      </div>

      {completedTasks === tasks.length && (
        <div className="mt-4 p-3 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-lg border border-pink-400/30">
          <p className="text-center text-pink-300 text-sm font-medium">
            🎉 All tasks completed! Great job!
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;
