// src/components/navbar.js
import { router } from '../router.js';

export function renderNavbar(activeTab) {
  return `
    <div style="position: fixed; bottom: 0; left: 0; right: 0; height: 80px; background-color: var(--color-bg); border-top: 2px solid var(--color-gray-200); display: flex; justify-content: space-around; align-items: center; z-index: 100;">
      <div class="nav-item ${activeTab === 'home' ? 'active' : ''}" data-route="/" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; color: ${activeTab === 'home' ? 'var(--color-primary)' : 'var(--color-gray-400)'};">
        <div style="font-size: 28px;">🏠</div>
      </div>
      <div class="nav-item ${activeTab === 'leaderboard' ? 'active' : ''}" data-route="/leaderboard" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; color: ${activeTab === 'leaderboard' ? 'var(--color-primary)' : 'var(--color-gray-400)'};">
        <div style="font-size: 28px;">🏆</div>
      </div>
      <div class="nav-item ${activeTab === 'profile' ? 'active' : ''}" data-route="/profile" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; color: ${activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-gray-400)'};">
        <div style="font-size: 28px;">👤</div>
      </div>
      <div class="nav-item ${activeTab === 'shop' ? 'active' : ''}" data-route="/shop" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; color: ${activeTab === 'shop' ? 'var(--color-primary)' : 'var(--color-gray-400)'};">
        <div style="font-size: 28px;">🏪</div>
      </div>
    </div>
  `;
}

export function attachNavbarListeners() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      const route = e.currentTarget.dataset.route;
      router.navigate(route);
    });
  });
}
