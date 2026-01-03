import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Footprints,
  Droplets,
  Ban,
  Sun,
  Smile,
  Brain,
  ShieldAlert,
  Award,
  Unlock,
  BookOpen,
  Flame,
  Trophy,
  CheckCircle2,
  Circle,
  Timer,
  Utensils,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // --- State ---
  const [waterCount, setWaterCount] = useState(0);
  const [steps, setSteps] = useState(0);
  
  const [dailyHabits, setDailyHabits] = useState({
    creatine: false,
    noSugar: false,
    protein: false,
    study: false,
    coldShower: false,
  });
  
  const [sideQuests, setSideQuests] = useState({
    skincare: false,
    noSwiggy: false,
    noNailBiting: false,
    reading: false,
  });

  const [loading, setLoading] = useState(true);

  // Define Side Quest List
  const sideQuestList = [
    { id: 'skincare', label: 'Moisturize & Sunscreen', icon: Sun },
    { id: 'noSwiggy', label: 'No Swiggy', icon: Ban },
    { id: 'noNailBiting', label: 'No Nail Biting', icon: Smile },
    { id: 'reading', label: 'Read 5-10 Pages', icon: BookOpen },
  ];

  // --- LOAD DATA (Local Storage) ---
  useEffect(() => {
    const savedData = localStorage.getItem('pratyukt-tracker-v1');
    const today = new Date().toDateString();

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.date === today) {
          setWaterCount(parsed.waterCount || 0);
          setSteps(parsed.steps || 0);
          setDailyHabits(parsed.dailyHabits || {
             creatine: false, noSugar: false, protein: false, study: false, coldShower: false
          });
          setSideQuests(parsed.sideQuests || {
             skincare: false, noSwiggy: false, noNailBiting: false, reading: false
          });
        } else {
          resetDaily(); 
        }
      } catch (e) {
        console.error("Error parsing saved data", e);
        resetDaily();
      }
    }
    setLoading(false);
  }, []);

  // --- SAVE DATA (Local Storage) ---
  useEffect(() => {
    if (!loading) {
      const dataToSave = {
        date: new Date().toDateString(),
        waterCount,
        steps,
        dailyHabits,
        sideQuests
      };
      localStorage.setItem('pratyukt-tracker-v1', JSON.stringify(dataToSave));
    }
  }, [waterCount, steps, dailyHabits, sideQuests, loading]);

  const toggleHabit = (habit) => {
    setDailyHabits(prev => ({ ...prev, [habit]: !prev[habit] }));
  };

  const toggleSideQuest = (quest) => {
    setSideQuests(prev => ({ ...prev, [quest]: !prev[quest] }));
  };

  const resetDaily = () => {
    setWaterCount(0);
    setSteps(0);
    setDailyHabits({
      creatine: false,
      noSugar: false,
      protein: false,
      study: false,
      coldShower: false,
    });
    setSideQuests({
      skincare: false,
      noSwiggy: false,
      noNailBiting: false,
      reading: false,
    });
  };

  // --- Progress Calculation ---
  
  // 1. Core Habits (Affects Top Bar)
  const habitsCount = Object.values(dailyHabits).filter(Boolean).length;
  const waterComplete = waterCount >= 4 ? 1 : 0;
  const stepsComplete = steps >= 10000 ? 1 : 0;
  
  const mainCompletedGoals = habitsCount + waterComplete + stepsComplete;
  const mainDenominator = 7; 
  const progressPercentage = Math.round((mainCompletedGoals / mainDenominator) * 100);

  // 2. Side Quests (Affects Red Bar Only)
  const sideQuestsCount = sideQuestList.filter(quest => sideQuests[quest.id]).length;
  const sideQuestTotal = sideQuestList.length;
  const sideQuestPercentage = Math.round((sideQuestsCount / sideQuestTotal) * 100);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* Header */}
      <header className="p-4 md:p-12 max-w-7xl mx-auto border-b border-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-white mb-2 leading-tight">
              Locked <span className="text-emerald-500">In</span>
            </h1>
            <p className="text-neutral-400 text-xs md:text-base max-w-md leading-relaxed">
              "Add 2 years to your actual age. Live with that maturity."
            </p>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3">
             <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider flex items-center gap-1">
              <Timer className="w-3 h-3" /> Resets Daily
            </span>
            <button
              onClick={resetDaily}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all rounded active:scale-95 flex items-center justify-center gap-2 bg-neutral-900 md:bg-transparent"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {/* Global Progress Bar (Main Habits Only) */}
          <div className="w-full bg-neutral-900 rounded-full h-6 md:h-8 border border-neutral-800 relative overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out flex items-center justify-end px-2 bg-emerald-600`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <span className={`text-[10px] md:text-sm font-bold drop-shadow-md text-white uppercase tracking-widest`}>
                Main Protocol: {progressPercentage}%
              </span>
            </div>
          </div>

          {/* MOVED: Side Quest Bar (Under Main Bar) */}
          <div className="w-full bg-neutral-900 rounded-full h-4 md:h-5 border border-red-900/30 relative overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-500 ease-out flex items-center justify-end px-2"
              style={{ width: `${sideQuestPercentage}%` }}
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <span className="text-[9px] md:text-xs font-bold drop-shadow-md text-red-100 uppercase tracking-widest">
                Side Quests: {sideQuestsCount}/{sideQuestTotal}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        {/* COLUMN 1: PHYSIQUE & HEALTH */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />
            <h2 className="font-bold tracking-widest text-xs md:text-sm uppercase">Physique & Health</h2>
          </div>

          {/* Main Goal Card */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 md:p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Dumbbell className="w-20 h-20 md:w-24 md:h-24" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">The Physical Standard</h3>
            <p className="text-neutral-400 text-xs md:text-sm mb-4">Shoot for lean. Aim for abs.</p>

            <div className="space-y-3">
              <button
                onClick={() => setSteps(steps >= 10000 ? 0 : 10000)}
                className={`w-full flex items-center p-3 rounded-xl border transition-all duration-200 active:scale-95 touch-manipulation ${
                  steps >= 10000
                    ? 'bg-emerald-900/20 border-emerald-500/50 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 border shrink-0 ${steps >= 10000 ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-neutral-700'}`}>
                  {steps >= 10000 && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <Footprints className="w-4 h-4 mr-3 opacity-70 shrink-0" />
                <span className="text-sm">10k Steps</span>
              </button>

              <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-sm flex items-center"><Droplets className="w-4 h-4 mr-2 text-blue-500 shrink-0"/> Water (4L)</span>
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pl-2">
                  {[1, 2, 3, 4].map((glass) => (
                    <button
                      key={glass}
                      onClick={() => setWaterCount(waterCount === glass ? glass - 1 : glass)}
                      className={`w-8 h-8 rounded-full border border-blue-900 flex items-center justify-center transition-all shrink-0 active:scale-90 touch-manipulation ${waterCount >= glass ? 'bg-blue-500 border-blue-500' : 'bg-transparent'}`}
                    >
                      {waterCount >= glass && <div className="w-2 h-2 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Checklist */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 md:p-6 rounded-2xl">
            <h4 className="text-[10px] md:text-xs font-mono uppercase text-neutral-500 mb-4">Daily Non-Negotiables</h4>
            <div className="space-y-2 md:space-y-3">
              {[
                { id: 'coldShower', label: 'Cold Shower', icon: Droplets },
                { id: 'creatine', label: 'Take Creatine', icon: Flame },
                { id: 'protein', label: 'Protein Intake', icon: Utensils },
                { id: 'noSugar', label: 'Zero Added Sugar', icon: Ban },
                { id: 'study', label: '15 Min Study', icon: Timer },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleHabit(item.id)}
                  className={`w-full flex items-center p-3 rounded-xl border transition-all duration-200 active:scale-95 touch-manipulation ${
                    dailyHabits[item.id]
                      ? 'bg-emerald-900/20 border-emerald-500/50 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 border shrink-0 ${dailyHabits[item.id] ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-neutral-700'}`}>
                    {dailyHabits[item.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <item.icon className="w-4 h-4 mr-3 opacity-70 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Side Quest Rewards (Bar Removed from here) */}
          <div className="bg-neutral-900/50 border border-red-900/30 p-4 md:p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] md:text-xs font-mono uppercase text-red-500 flex items-center">
                <Zap className="w-3 h-3 mr-1" /> Side Quest Rewards
              </h4>
            </div>

            <div className="space-y-2 md:space-y-3">
              {sideQuestList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleSideQuest(item.id)}
                  className={`w-full flex items-center p-3 rounded-xl border transition-all duration-200 active:scale-95 touch-manipulation ${
                    sideQuests[item.id]
                      ? 'bg-red-900/20 border-red-500/50 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-red-900/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 border shrink-0 ${sideQuests[item.id] ? 'bg-red-600 border-red-600 text-neutral-950' : 'border-neutral-700'}`}>
                    {sideQuests[item.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <item.icon className={`w-4 h-4 mr-3 shrink-0 ${sideQuests[item.id] ? 'text-red-400' : 'opacity-70'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: MINDSET & CHARACTER */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center space-x-2 text-purple-400 mb-1">
            <Brain className="w-4 h-4 md:w-5 md:h-5" />
            <h2 className="font-bold tracking-widest text-xs md:text-sm uppercase">Mindset & Character</h2>
          </div>

          <div className="grid gap-4">
            {/* The Maturity Rule */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold text-white mb-2">Age + 2 Years</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Operate with a maturity level two years ahead of your actual age. Calm, collected, visionary.
              </p>
            </div>

            {/* No Randirona */}
            <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl flex items-start space-x-4">
              <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-200 mb-1">NO "RANDIRONA"</h4>
                <p className="text-xs text-red-200/70">
                  - kisi k aage weak nahi banna hai .khudke aage bhi nahi
                </p>
              </div>
            </div>

            {/* Integrity Card */}
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3 text-neutral-300">
                <Award className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-sm font-medium">Don't half-ass things.</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium">Keep your word. Always.</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <Unlock className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm font-medium">Live with no secrets.</span>
              </div>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Phone Status</p>
              <p className="text-emerald-400 font-mono text-sm">Unlocked & Open</p>
            </div>
          </div>
        </div>

        {/* COLUMN 3: PRODUCTIVITY & LIFESTYLE */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
            <h2 className="font-bold tracking-widest text-xs md:text-sm uppercase">Lifestyle</h2>
          </div>

          {/* The Ritual */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 md:p-6 rounded-2xl">
            <h3 className="text-white font-medium mb-3">Protocol</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 bg-neutral-950 rounded-xl border-l-2 border-purple-500">
                <p className="text-[10px] text-neutral-400 uppercase mb-1">Daily Task</p>
                <p className="text-sm text-neutral-200">Organize and provide results. Do not just "work." Produce.</p>
              </div>
              <div className="p-3 bg-neutral-950 rounded-xl border-l-2 border-red-500">
                <p className="text-[10px] text-neutral-400 uppercase mb-1">Trigger</p>
                <p className="text-sm text-neutral-200">Create a specific ritual for "Locking In."</p>
              </div>
            </div>
          </div>

          {/* Content Diet */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 md:p-6 rounded-2xl">
            <h3 className="text-white font-medium mb-3">Content Diet</h3>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-neutral-400">
                <Circle className="w-2 h-2 mt-1.5 mr-2 text-emerald-500 fill-emerald-500 shrink-0" />
                Follow creators who make you want to be better (Art/Productivity).
              </li>
              <li className="flex items-start text-sm text-neutral-400">
                <Circle className="w-2 h-2 mt-1.5 mr-2 text-orange-500 fill-orange-500 shrink-0" />
                Follow a new sport (Basketball / F1).
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="text-center text-neutral-600 text-xs py-8 px-4">
        Designed for the 2.0 Version of You.
      </footer>
    </div>
  );
}
