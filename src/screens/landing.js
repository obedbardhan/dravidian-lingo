import { state } from '../state.js';
import { router } from '../router.js';

export default function createLandingScreen(container) {
  const mount = () => {
    container.innerHTML = `
      <div class="screen flex-center flex-col animate-slide-up" style="background-color: var(--color-bg);">
        <div style="text-align: center; margin-bottom: var(--spacing-6);">
          <div style="font-size: 80px; animation: bounce 2s infinite;">🦉</div>
          <h1 style="color: var(--color-primary); font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-top: 10px;">DravidianLingo</h1>
          <p style="color: var(--color-gray-400); font-size: 18px;">Learn South Indian languages the fun way.</p>
        </div>
        
        <div class="flex-col gap-3" style="width: 100%; max-width: 320px;">
          <button class="btn btn-primary" id="btn-get-started">Get Started</button>
          <button class="btn btn-ghost" id="btn-login" style="color: var(--color-secondary); font-weight: 800; border-color: var(--color-gray-200);">I ALREADY HAVE AN ACCOUNT</button>
        </div>
      </div>
    `;

    document.getElementById('btn-get-started').addEventListener('click', () => {
      renderLanguageSelection();
    });
  };

  const renderLanguageSelection = () => {
    container.innerHTML = `
      <div class="screen flex-col animate-slide-right">
        <h2 style="text-align: center; margin-top: var(--spacing-4);">I want to learn...</h2>
        
        <div class="flex-col gap-3" style="margin-top: var(--spacing-4);">
          
          <div class="card flex-row align-center gap-3 lang-select" data-lang="tamil" style="cursor: pointer; padding: var(--spacing-3);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background-color: var(--lang-tamil); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px;">த</div>
            <div style="flex: 1;">
              <h3 style="margin: 0;">Tamil</h3>
              <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Spoken in Tamil Nadu</p>
            </div>
          </div>

          <div class="card flex-row align-center gap-3 lang-select" data-lang="telugu" style="cursor: pointer; padding: var(--spacing-3);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background-color: var(--lang-telugu); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px;">తె</div>
            <div style="flex: 1;">
              <h3 style="margin: 0;">Telugu</h3>
              <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Spoken in AP & Telangana</p>
            </div>
          </div>

          <div class="card flex-row align-center gap-3 lang-select" data-lang="kannada" style="cursor: pointer; padding: var(--spacing-3);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background-color: var(--lang-kannada); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px;">ಕ</div>
            <div style="flex: 1;">
              <h3 style="margin: 0;">Kannada</h3>
              <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Spoken in Karnataka</p>
            </div>
          </div>

          <div class="card flex-row align-center gap-3 lang-select" data-lang="malayalam" style="cursor: pointer; padding: var(--spacing-3);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background-color: var(--lang-malayalam); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px;">മ</div>
            <div style="flex: 1;">
              <h3 style="margin: 0;">Malayalam</h3>
              <p style="margin: 0; color: var(--color-gray-400); font-size: 14px;">Spoken in Kerala</p>
            </div>
          </div>

        </div>
        
        <div style="margin-top: auto; padding-top: var(--spacing-4);">
          <button class="btn btn-ghost" id="btn-back" style="color: var(--color-gray-400);">BACK</button>
        </div>
      </div>
    `;

    document.querySelectorAll('.lang-select').forEach(el => {
      el.addEventListener('click', (e) => {
        const lang = e.currentTarget.dataset.lang;
        state.setLanguage(lang);
        router.navigate('/home');
      });
    });

    document.getElementById('btn-back').addEventListener('click', mount);
  };

  const unmount = () => {
    // cleanup listeners if necessary
  };

  return { mount, unmount };
}
