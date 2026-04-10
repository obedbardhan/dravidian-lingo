export const state = {
  data: {
    user: {
      name: 'Guest',
      avatar: '🐣',
      totalXp: 0,
      streak: 0,
      hearts: 5,
      lastActive: new Date().toISOString().split('T')[0],
      gems: 500
    },
    currentLanguage: null, /* 'tamil', 'telugu', 'kannada', 'malayalam' */
    progress: {
      tamil: { unlockedSkills: ['basics_1'], completedSkills: {}, xp: 0 },
      telugu: { unlockedSkills: ['basics_1'], completedSkills: {}, xp: 0 },
      kannada: { unlockedSkills: ['basics_1'], completedSkills: {}, xp: 0 },
      malayalam: { unlockedSkills: ['basics_1'], completedSkills: {}, xp: 0 },
    }
  },

  listeners: [],

  _stateVersion: 2, // Bump this when curriculum structure changes

  init() {
    const saved = localStorage.getItem('dravidian_state');
    const savedVersion = localStorage.getItem('dravidian_version');

    // If version mismatch, clear old state to avoid stale data
    if (savedVersion !== String(this._stateVersion)) {
      localStorage.removeItem('dravidian_state');
      localStorage.setItem('dravidian_version', String(this._stateVersion));
      this.save();
      return;
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.data.currentLanguage = parsed.currentLanguage || null;
        this.data.user = { ...this.data.user, ...parsed.user };
        this.data.progress = { ...this.data.progress, ...parsed.progress };
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    this.checkStreak();
    this.save();
  },

  save() {
    localStorage.setItem('dravidian_state', JSON.stringify(this.data));
    this.notify();
  },

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notify() {
    this.listeners.forEach(l => l(this.data));
  },

  setLanguage(langId) {
    this.data.currentLanguage = langId;
    this.save();
  },

  addXp(amount) {
    this.data.user.totalXp += amount;
    if (this.data.currentLanguage) {
      this.data.progress[this.data.currentLanguage].xp += amount;
    }
    this.save();
  },

  useHeart() {
    if (this.data.user.hearts > 0) {
      this.data.user.hearts -= 1;
      this.save();
      return true;
    }
    return false;
  },

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.data.user.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (this.data.user.lastActive !== yesterday && this.data.user.lastActive !== today) {
        // Lost streak
        this.data.user.streak = 0;
      } else if (this.data.user.lastActive === yesterday) {
        // Implicitly kept streak going if they are active today, 
        // Note: typically streak increments when daily goal is met. 
        // For simplicity, we just keep it if they logged in.
      }
      this.data.user.lastActive = today;
    }
  },

  completeLesson(skillId, xpEarned) {
    const lang = this.data.currentLanguage;
    if (!lang) return;

    // Add XP
    this.addXp(xpEarned);

    // Update skill progress
    if (!this.data.progress[lang].completedSkills[skillId]) {
      this.data.progress[lang].completedSkills[skillId] = 0;
    }
    this.data.progress[lang].completedSkills[skillId] += 1;

    // Unlock next skill logic could go here based on curriculum
    this.save();
  }
};
