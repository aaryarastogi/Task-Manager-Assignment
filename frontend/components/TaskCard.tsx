'use client';

import { Task, TaskStatus } from '@/lib/tasks';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const statusColors: Record<TaskStatus, string> = {
  PENDING: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg',
  IN_PROGRESS: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg',
  COMPLETED: 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg',
};

const statusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex-1 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColors[task.status]} transform group-hover:scale-110 transition-transform`}>
          {statusLabels[task.status]}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 mb-5 text-sm leading-relaxed line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onToggle(task.id)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl hover:from-indigo-200 hover:to-purple-200 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🔄 Toggle
        </button>
        <button
          onClick={() => onEdit(task)}
          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-cyan-200 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🗑️ Delete
        </button>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Created: {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

