import { state } from '../state.js';
import { renderNavbar, attachNavbarListeners } from '../components/navbar.js';

export default function createLeaderboardScreen(container) {
  const mount = () => {

    // Mock data for leaderboard
    const users = [
      { name: 'Karthik', xp: 1250, avatar: '👨🏽' },
      { name: 'Meena', xp: 980, avatar: '👩🏾' },
      { name: 'Rahul', xp: 850, avatar: '👱🏽‍♂️' },
      { name: 'Priya', xp: 720, avatar: '👩🏻' },
      { name: state.data.user.name, xp: state.data.user.totalXp, avatar: state.data.user.avatar, isMe: true },
      { name: 'Arjun', xp: 450, avatar: '👨🏻‍𱆧' },
      { name: 'Sneha', xp: 320, avatar: '👧🏽' },
    ].sort((a, b) => b.xp - a.xp);

    let boardHtml = '';
    users.forEach((u, i) => {
      boardHtml += `
        <div class="card flex-row align-center gap-3" style="padding: 12px 16px; margin-bottom: 8px; border-color: ${u.isMe ? 'var(--color-secondary)' : 'var(--color-gray-200)'}; background-color: ${u.isMe ? '#e1f5fe' : 'white'};">
          <div style="font-weight: 900; color: ${i < 3 ? 'var(--color-warning)' : 'var(--color-gray-400)'}; width: 24px; text-align: center;">${i + 1}</div>
          <div style="font-size: 32px;">${u.avatar}</div>
          <div style="flex: 1; font-weight: 800; font-size: 16px;">${u.name} ${u.isMe ? '(You)' : ''}</div>
          <div style="font-weight: 800; color: var(--color-gray-500);">${u.xp} XP</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="screen" style="padding-bottom: 100px;">
        <h2 style="text-align: center; margin-bottom: 16px;">Bronze League</h2>
        <p style="text-align: center; color: var(--color-gray-400); margin-bottom: 32px;">Top 3 advance to Silver League</p>
        
        <div class="flex-col">
          ${boardHtml}
        </div>
      </div>
      
      ${renderNavbar('leaderboard')}
    `;

    attachNavbarListeners();
  };

  const unmount = () => { };

  return { mount, unmount };
}
