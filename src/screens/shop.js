import { state } from '../state.js';
import { renderNavbar, attachNavbarListeners } from '../components/navbar.js';

export default function createShopScreen(container) {
  let unsubscribe;

  const mount = () => {
    container.innerHTML = `
      <div class="screen" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">Shop</h2>
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--color-secondary);">
            <div style="background: var(--color-secondary); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">💎</div>
            ${state.data.user.gems || 0}
          </div>
        </div>
        
        <h3 style="margin-bottom: 16px;">Hearts</h3>
        
        <div class="card flex-row align-center gap-3" style="margin-bottom: 16px;">
          <div style="font-size: 40px;">❤️</div>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 16px;">Refill Hearts</h4>
            <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Get full hearts to keep learning</p>
          </div>
          <button id="btn-refill" class="btn btn-primary" style="padding: 8px 16px; font-size: 14px; width: auto;" ${state.data.user.hearts >= 5 ? 'disabled' : ''}>
            ${state.data.user.hearts >= 5 ? 'FULL' : '350 💎'}
          </button>
        </div>

        <h3 style="margin-bottom: 16px;">Power-Ups</h3>
        
        <div class="card flex-row align-center gap-3" style="margin-bottom: 16px;">
          <div style="font-size: 40px;">❄️</div>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 16px;">Streak Freeze</h4>
            <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Miss a day of practice without losing your streak.</p>
          </div>
          <button class="btn btn-ghost" style="padding: 8px 16px; font-size: 14px; width: auto; color: var(--color-secondary); border-color: var(--color-secondary);">200 💎</button>
        </div>
        
        <h3 style="margin-bottom: 16px;">Outfits</h3>
        
        <div class="card flex-row align-center gap-3" style="margin-bottom: 16px;">
          <div style="font-size: 40px;">👔</div>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 16px;">Formal Owl</h4>
            <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Dapper mascot look.</p>
          </div>
          <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 14px; width: auto;">400 💎</button>
        </div>
      </div>
      
      ${renderNavbar('shop')}
    `;

    attachNavbarListeners();

    const refillBtn = document.getElementById('btn-refill');
    if (refillBtn) {
      refillBtn.addEventListener('click', () => {
        if (state.data.user.hearts < 5 && state.data.user.gems >= 350) {
          state.data.user.hearts = 5;
          state.data.user.gems -= 350;
          state.save();
        } else if (state.data.user.gems < 350) {
          alert("Not enough gems!");
        }
      });
    }

    unsubscribe = state.subscribe(() => {
      mount();
    });
  };

  const unmount = () => {
    if (unsubscribe) unsubscribe();
  };

  return { mount, unmount };
}
