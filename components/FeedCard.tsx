import React from 'react';
import { Post } from '../types';
import { getUserById, getMedalById } from '../services/mockService';
import { Heart, MessageCircle, Gift } from 'lucide-react';
import { TranslationKey } from '../services/i18n';

interface FeedCardProps {
  post: Post;
  onLike: (postId: string) => void;
  t: (key: TranslationKey) => string;
}

const FeedCard: React.FC<FeedCardProps> = ({ post, onLike, t }) => {
  const sender = getUserById(post.senderId);
  const medal = getMedalById(post.medalId);
  
  if (!sender || !medal) return null;

  const receiverNames = post.receiverIds.map(id => getUserById(id)?.name).join(', ');

  // Format relative time (localized)
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return t('justNow');
    
    if (hours < 24) {
      return `${hours}${t('h')} ${t('ago')}`;
    }
    const days = Math.floor(hours / 24);
    return `${days}${t('d')} ${t('ago')}`;
  };

  return (
    <div className="bg-white p-4 mb-3 border-b border-slate-100 last:border-0 md:rounded-xl md:shadow-sm md:border md:mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
          <img 
            src={sender.avatar} 
            alt={sender.name} 
            className="w-10 h-10 rounded-full object-cover border border-slate-100" 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{sender.name}</span>
              <span className="text-xs text-slate-400">• {sender.department}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
               {timeAgo(post.createdAt)}
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <span className="text-xl">...</span>
        </button>
      </div>

      {/* Action Statement */}
      <div className="mb-3 text-sm text-slate-700">
        {t('awarded')} <span className="font-semibold text-primary-600">{receiverNames}</span>
      </div>

      {/* SBI Content */}
      <div className="mb-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Medal Card (Inset) */}
      <div className={`p-4 rounded-lg border ${medal.colorBorder} ${medal.colorBg} flex items-center gap-4 mb-4`}>
        <div className="w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-full shadow-sm shrink-0">
          {medal.icon}
        </div>
        <div className="flex-1">
          <div className={`font-bold text-lg ${medal.textColor}`}>
            {medal.value.toFixed(2)} <span className="text-xs font-medium text-slate-500">{t('coins')}</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            {medal.name}
          </div>
          <div className="text-xs text-slate-500 line-clamp-2">
            {medal.description}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${post.hasLiked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Heart size={18} fill={post.hasLiked ? "currentColor" : "none"} />
            <span>{post.likes}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
            <MessageCircle size={18} />
            <span>{post.comments.length > 0 ? t('comment') : t('comment')}</span>
          </button>

          <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
            <Gift size={18} />
            <span>{t('bonus')}</span>
          </button>
        </div>
        
        <button className="flex items-center gap-1 text-xs text-slate-400">
            <span>{t('details')}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      
      {/* Comments Preview */}
      {post.comments.length > 0 && (
        <div className="mt-3 bg-slate-50 p-2 rounded text-xs text-slate-600">
            {post.comments.map(c => (
                <div key={c.id} className="mb-1 last:mb-0">
                    <span className="font-semibold text-slate-800">{c.userName}:</span> {c.content}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FeedCard;