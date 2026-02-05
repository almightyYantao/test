import React, { useState, useEffect } from 'react';
import { User, Post, View, Medal, Product } from './types';
import { USERS, POSTS, MEDALS, PRODUCTS, getMedalById } from './services/mockService';
import TabBar from './components/TabBar';
import FeedCard from './components/FeedCard';
import { Search, Bell, BarChart2, Briefcase, Plus, Coins, Zap, Users, ShieldCheck, ChevronRight, Gift, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]); // Default to Alex (Admin)
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  
  // Data State
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [medals] = useState<Medal[]>(MEDALS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Form State
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [selectedMedal, setSelectedMedal] = useState<string | null>(null);
  const [sbiText, setSbiText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Admin State
  const [adminTab, setAdminTab] = useState<'users' | 'medals'>('users');

  // --- Actions ---

  const handleLike = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        // Logic: Like gives +0.1 coin (simulated) to receiver, handled in backend usually
        const newLikeState = !p.hasLiked;
        return {
          ...p,
          likes: newLikeState ? p.likes + 1 : p.likes - 1,
          hasLiked: newLikeState
        };
      }
      return p;
    }));
  };

  const handleSubmitAward = () => {
    if (selectedReceivers.length === 0 || !selectedMedal || !sbiText.trim()) {
      setFeedbackMsg("Please complete all fields");
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    const medal = getMedalById(selectedMedal);
    const cost = (medal?.value || 0) * selectedReceivers.length;

    if (currentUser.giveQuota < cost) {
      setFeedbackMsg(`Insufficient Nuclear Energy. Cost: ${cost}, You have: ${currentUser.giveQuota}`);
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    // Deduct Quota
    const updatedUser = { ...currentUser, giveQuota: currentUser.giveQuota - cost };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Update Receivers Wallet (Mock)
    setUsers(prev => prev.map(u => {
        if (selectedReceivers.includes(u.id)) {
            return { ...u, walletBalance: u.walletBalance + (medal?.value || 0) };
        }
        return u;
    }));

    // Create Post
    const newPost: Post = {
      id: `p${Date.now()}`,
      senderId: currentUser.id,
      receiverIds: selectedReceivers,
      medalId: selectedMedal,
      content: sbiText,
      createdAt: new Date().toISOString(),
      likes: 0,
      hasLiked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setSbiText('');
    setSelectedMedal(null);
    setSelectedReceivers([]);
    setCurrentView(View.HOME);
    setFeedbackMsg("Award sent successfully!");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleRedeem = (product: Product) => {
    if (product.stock <= 0) {
      setFeedbackMsg("Item out of stock");
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    if (currentUser.walletBalance < product.price) {
       setFeedbackMsg(`Insufficient coins. Need ${product.price}, have ${currentUser.walletBalance.toFixed(0)}`);
       setTimeout(() => setFeedbackMsg(null), 3000);
       return;
    }

    // Deduct stock
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));

    // Deduct wallet
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - product.price };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));

    setFeedbackMsg(`Successfully redeemed ${product.name}!`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // --- Render Views ---

  const renderHome = () => (
    <div className="pb-20">
      {/* Top Nav */}
      <header className="sticky top-0 bg-white z-10 border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-brand-500 bg-clip-text text-transparent">EnergyRewards</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
             <Bell size={20} className="text-slate-600" />
             <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</div>
          </div>
          <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full border border-slate-200" />
        </div>
      </header>

      {/* Sub-header Filter (Mock) */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex gap-4 overflow-x-auto no-scrollbar">
        <button className="text-sm font-semibold text-slate-800 border-b-2 border-primary-600 pb-1 whitespace-nowrap">All Departments</button>
        <button className="text-sm font-medium text-slate-500 pb-1 whitespace-nowrap">My Department</button>
        <button className="text-sm font-medium text-slate-500 pb-1 whitespace-nowrap">Following</button>
      </div>

      {/* Feed */}
      <main className="max-w-2xl mx-auto pt-4 md:px-4">
        {posts.map(post => (
          <FeedCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} />
        ))}
        <div className="text-center text-slate-400 text-sm py-6">
            You're all caught up!
        </div>
      </main>
    </div>
  );

  const renderLeaderboard = () => {
    const sortedUsers = [...users].sort((a, b) => b.walletBalance - a.walletBalance);
    const top3 = sortedUsers.slice(0, 3);
    const rest = sortedUsers.slice(3);

    const chartData = top3.map(u => ({ name: u.name.split(' ')[0], value: u.walletBalance }));

    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
           <h2 className="text-2xl font-bold relative z-10 text-center mb-6">Energy Leaderboard</h2>
           
           {/* Simple Chart */}
           <div className="h-40 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'white', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8, border: 'none'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#e2e8f0'} fillOpacity={index === 0 ? 1 : 0.6} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </header>

        <div className="px-4 -mt-8 relative z-20 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="text-sm font-semibold text-slate-600">This Month</span>
                    <button className="text-xs text-primary-600 font-medium">View Full Report</button>
                </div>
                {sortedUsers.map((user, idx) => (
                    <div key={user.id} className="flex items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className={`w-8 text-center font-bold mr-4 ${idx < 3 ? 'text-xl' : 'text-sm text-slate-400'}`}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </div>
                        <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-100 mr-3" />
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.department}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-primary-600">{user.walletBalance.toFixed(0)}</div>
                            <div className="text-[10px] text-slate-400">Coins</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  const renderCreate = () => (
    <div className="pb-20 min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <h2 className="text-lg font-bold text-center">Give Recognition</h2>
      </header>
      
      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Quota Display */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-5 text-white shadow-lg shadow-brand-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-brand-100 text-sm font-medium mb-1">Available Nuclear Energy</div>
                    <div className="text-4xl font-bold flex items-baseline gap-1">
                        {currentUser.giveQuota} <span className="text-lg font-normal opacity-80">pts</span>
                    </div>
                </div>
                <Zap className="text-brand-200 opacity-50" size={48} />
            </div>
            <div className="mt-4 text-xs text-brand-100 bg-brand-900/20 py-1 px-2 rounded inline-block">
                Resets on March 1st
            </div>
        </div>

        {/* Step 1: Who */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-3">Who are you recognizing?</label>
            <div className="flex flex-wrap gap-2 mb-3">
                {users.filter(u => u.id !== currentUser.id).map(u => {
                    const isSelected = selectedReceivers.includes(u.id);
                    return (
                        <button
                            key={u.id}
                            onClick={() => {
                                if (isSelected) setSelectedReceivers(prev => prev.filter(id => id !== u.id));
                                else setSelectedReceivers(prev => [...prev, u.id]);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
                                isSelected 
                                ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            <img src={u.avatar} className="w-5 h-5 rounded-full" />
                            {u.name}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Step 2: Medal */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
             <label className="block text-sm font-bold text-slate-700 mb-3">Select a Medal</label>
             <div className="grid grid-cols-2 gap-3">
                {medals.map(m => {
                    const isSelected = selectedMedal === m.id;
                    return (
                        <button 
                            key={m.id}
                            onClick={() => setSelectedMedal(m.id)}
                            className={`relative p-3 rounded-lg border text-left transition-all ${
                                isSelected ? `ring-2 ring-offset-1 ring-${m.textColor.split('-')[1]}-500 bg-slate-50 border-transparent` : 'border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl">{m.icon}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-100 shadow-sm`}>
                                    {m.value} pts
                                </span>
                            </div>
                            <div className="font-semibold text-sm text-slate-800">{m.name}</div>
                        </button>
                    )
                })}
             </div>
        </div>

        {/* Step 3: SBI */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">The Story (SBI)</label>
                <button className="text-xs text-primary-600 flex items-center gap-1">
                    <Briefcase size={12} />
                    What is SBI?
                </button>
            </div>
            <textarea
                value={sbiText}
                onChange={(e) => setSbiText(e.target.value)}
                placeholder="Situation: During the project launch...&#10;Behavior: You stayed late to fix the critical bug...&#10;Impact: Which ensured a zero-downtime release."
                className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            />
        </div>

        {/* Submit */}
        <div className="pt-2 pb-8">
            <button 
                onClick={handleSubmitAward}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
                <Gift size={20} />
                Send Award ({selectedMedal ? (medals.find(m => m.id === selectedMedal)?.value || 0) * (selectedReceivers.length || 1) : 0} Energy)
            </button>
        </div>
      </main>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-2xl z-50 text-sm font-medium animate-fade-in">
            {feedbackMsg}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="pb-20 min-h-screen bg-slate-50">
        <header className="bg-white p-6 pb-8 text-center border-b border-slate-200">
            <div className="relative inline-block">
                <img src={currentUser.avatar} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md" />
                <button 
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-slate-200 text-slate-600"
                  onClick={() => {
                     // Toggle user for demo purposes
                     const nextIdx = (users.findIndex(u => u.id === currentUser.id) + 1) % users.length;
                     setCurrentUser(users[nextIdx]);
                  }}
                >
                    <Users size={16} />
                </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-slate-500">{currentUser.department}</p>
        </header>

        <main className="p-4 max-w-2xl mx-auto space-y-4 -mt-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">My Wallet</div>
                    <div className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                        <Coins size={24} />
                        {currentUser.walletBalance.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">Energy Coins (Do not expire)</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Monthly Quota</div>
                    <div className="text-2xl font-bold text-brand-600 flex items-center gap-2">
                        <Zap size={24} />
                        {currentUser.giveQuota}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">Nuclear Energy (Resets monthly)</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50 font-bold text-slate-800">My Medals</div>
                <div className="p-4 grid grid-cols-4 gap-4">
                    {/* Simulated received medals */}
                    {[1, 1, 3, 2].map((mId, i) => {
                        const m = MEDALS[mId];
                        return (
                            <div key={i} className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full ${m.colorBg} flex items-center justify-center text-xl mb-1`}>
                                    {m.icon}
                                </div>
                                <span className="text-[10px] text-slate-600 leading-tight">{m.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <button 
              onClick={() => setCurrentView(View.MALL)}
              className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50"
            >
                <span className="font-semibold text-slate-700">Redeem Shop</span>
                <ChevronRight className="text-slate-400" size={20} />
            </button>
        </main>
    </div>
  );

  const renderMall = () => (
    <div className="pb-20 min-h-screen bg-slate-50">
        <header className="bg-white p-4 sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200">
            <button onClick={() => setCurrentView(View.PROFILE)} className="text-slate-600 p-1">
                <ArrowLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Redeem Shop</h2>
            <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-full text-primary-700 text-sm font-bold">
                <Coins size={14} />
                {currentUser.walletBalance.toFixed(0)}
            </div>
        </header>

        <main className="p-4 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="h-32 bg-slate-200 relative">
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                                OUT OF STOCK
                            </div>
                        )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm text-slate-800 mb-1">{product.name}</h3>
                        <div className="text-xs text-slate-500 mb-3">{product.stock} left</div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="font-bold text-primary-600 text-sm">{product.price} Coins</span>
                        </div>
                        <button 
                            onClick={() => handleRedeem(product)}
                            disabled={product.stock <= 0 || currentUser.walletBalance < product.price}
                            className={`mt-2 w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                                product.stock > 0 && currentUser.walletBalance >= product.price
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Redeem
                        </button>
                    </div>
                </div>
            ))}
        </main>
    </div>
  );

  const renderAdmin = () => (
    <div className="pb-20 min-h-screen bg-slate-50">
        <header className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2">
                <ShieldCheck size={20} />
                Admin Console
            </h2>
        </header>

        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 border-b border-slate-200">
                <button 
                    onClick={() => setAdminTab('users')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${adminTab === 'users' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500'}`}
                >
                    User Management
                </button>
                <button 
                    onClick={() => setAdminTab('medals')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${adminTab === 'medals' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500'}`}
                >
                    Medal Settings
                </button>
            </div>

            {adminTab === 'users' ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="p-3">Employee</th>
                                <th className="p-3">Dept</th>
                                <th className="p-3 text-right">Quota (Give)</th>
                                <th className="p-3 text-right">Balance (Wallet)</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="p-3 flex items-center gap-2">
                                        <img src={u.avatar} className="w-6 h-6 rounded-full" />
                                        {u.name}
                                    </td>
                                    <td className="p-3 text-slate-500">{u.department}</td>
                                    <td className="p-3 text-right font-mono">{u.giveQuota}</td>
                                    <td className="p-3 text-right font-mono text-primary-600">{u.walletBalance}</td>
                                    <td className="p-3 text-center">
                                        <button className="text-blue-600 hover:underline text-xs">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {medals.map(m => (
                        <div key={m.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-start gap-3">
                            <div className="text-3xl bg-slate-50 p-2 rounded">{m.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-slate-800">{m.name}</h3>
                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">ID: {m.id}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                    <div>Value: <span className="font-bold">{m.value}</span></div>
                                    <button className="text-blue-600 text-xs font-medium">Edit Config</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors">
                        <Plus size={24} />
                        <span className="text-sm font-medium mt-1">Create New Medal</span>
                    </button>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      {currentView === View.HOME && renderHome()}
      {currentView === View.LEADERBOARD && renderLeaderboard()}
      {currentView === View.CREATE && renderCreate()}
      {currentView === View.PROFILE && renderProfile()}
      {currentView === View.MALL && renderMall()}
      {currentView === View.ADMIN && renderAdmin()}

      {/* Hide TabBar on Mall view to prevent clutter, or keep it. Let's keep it for easy nav, but typically detail views hide tabs in mobile apps.
          But here, let's keep it simple. */}
      {currentView !== View.MALL && (
        <TabBar 
            currentView={currentView} 
            onChange={setCurrentView} 
            isAdmin={currentUser.role === 'admin'} 
        />
      )}
      
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-2xl z-50 text-sm font-medium animate-fade-in">
            {feedbackMsg}
        </div>
      )}
    </div>
  );
};

export default App;