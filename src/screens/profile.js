import { state } from '../state.js';
import { renderNavbar, attachNavbarListeners } from '../components/navbar.js';

export default function createProfileScreen(container) {
  const mount = () => {
    const user = state.data.user;

    container.innerHTML = `
      <div class="screen" style="padding-bottom: 100px;">
        <h2 style="text-align: center; margin-bottom: 24px;">Profile</h2>
        
        <div class="flex-center flex-col" style="margin-bottom: 32px;">
          <div style="font-size: 80px; margin-bottom: 16px;">${user.avatar}</div>
          <h3 style="font-size: 24px; margin: 0;">${user.name}</h3>
          <p style="color: var(--color-gray-400); margin: 0;">Joined ${user.lastActive}</p>
        </div>

        <h3 style="margin-bottom: 16px;">Statistics</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
          <div class="card" style="display: flex; gap: 12px; align-items: center;">
            <div style="font-size: 24px;">🔥</div>
            <div>
              <div style="font-weight: 800; font-size: 18px;">${user.streak}</div>
              <div style="color: var(--color-gray-400); font-size: 14px; font-weight: bold;">Day Streak</div>
            </div>
          </div>
          <div class="card" style="display: flex; gap: 12px; align-items: center;">
            <div style="font-size: 24px;">⚡</div>
            <div>
              <div style="font-weight: 800; font-size: 18px;">${user.totalXp}</div>
              <div style="color: var(--color-gray-400); font-size: 14px; font-weight: bold;">Total XP</div>
            </div>
          </div>
        </div>

        <h3 style="margin-bottom: 16px;">Achievements</h3>
        <div class="card" style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div style="font-size: 40px; color: ${user.streak >= 3 ? 'var(--color-warning)' : 'var(--color-gray-200)'};">🔥</div>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 16px;">Wildfire</h4>
            <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Reach a 3 day streak</p>
            <div style="height: 12px; background: var(--color-gray-200); border-radius: 6px; margin-top: 8px; overflow: hidden;">
              <div style="width: ${Math.min((user.streak / 3) * 100, 100)}%; height: 100%; background: var(--color-warning);"></div>
            </div>
          </div>
        </div>

        <div class="card" style="display: flex; gap: 16px; align-items: center;">
          <div style="font-size: 40px; color: ${user.totalXp >= 100 ? 'var(--color-primary)' : 'var(--color-gray-200)'};">🎯</div>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 16px;">Sharpshooter</h4>
            <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Earn 100 XP</p>
            <div style="height: 12px; background: var(--color-gray-200); border-radius: 6px; margin-top: 8px; overflow: hidden;">
              <div style="width: ${Math.min((user.totalXp / 100) * 100, 100)}%; height: 100%; background: var(--color-primary);"></div>
            </div>
          </div>
        </div>
      </div>
      
      ${renderNavbar('profile')}
    `;

    attachNavbarListeners();
  };

  const unmount = () => { };

  return { mount, unmount };
}
