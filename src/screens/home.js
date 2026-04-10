import { state } from '../state.js';
import { router } from '../router.js';
import { curriculum } from '../data/curriculum.js';
import { renderNavbar, attachNavbarListeners } from '../components/navbar.js';

export default function createHomeScreen(container) {
  let unsubscribe;

  const mount = () => {
    const lang = state.data.currentLanguage;
    if (!lang) {
      router.navigate('/');
      return;
    }

    const langCurriculum = curriculum[lang] || [];
    const progress = state.data.progress[lang];

    // Group skills by unit
    const unitsData = {};
    langCurriculum.forEach(skill => {
      if (!unitsData[skill.unit]) {
        unitsData[skill.unit] = { title: skill.unitTitle, skills: [] };
      }
      unitsData[skill.unit].skills.push(skill);
    });

    let itemsHtml = '';

    Object.values(unitsData).forEach(unit => {
      itemsHtml += `
        <div style="margin-top: 40px; margin-bottom: 20px;">
          <h2 style="text-align: center; text-transform: capitalize; color: var(--color-gray-400); margin-bottom: 10px;">${unit.title}</h2>
          <hr style="border: none; border-top: 2px solid var(--color-gray-200); width: 80%; margin: 0 auto 30px auto;" />
        </div>
      `;

      unit.skills.forEach((skill, index) => {
        const isUnlocked = progress.unlockedSkills.includes(skill.id) || skill.requiredLevel <= Object.keys(progress.completedSkills).length;
        const crowns = progress.completedSkills[skill.id] || 0;

        // Calculate zig-zag offset
        const offset = Math.sin(index * 1.5) * 40;

        itemsHtml += `
          <div class="flex-center" style="margin: 20px 0; transform: translateX(${offset}px);">
            <div class="skill-node ${isUnlocked ? 'unlocked' : 'locked'}" data-skill="${skill.id}" data-unlocked="${isUnlocked}" 
                 style="
                   width: 80px; 
                   height: 80px; 
                   border-radius: 50%; 
                   background-color: ${isUnlocked ? skill.color : 'var(--color-gray-200)'};
                   border: 6px solid ${isUnlocked ? 'var(--color-bg)' : 'var(--color-bg)'};
                   box-shadow: 0 6px 0 ${isUnlocked ? skill.color.replace(')', '-shadow)') : 'var(--color-gray-200)'};
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   font-size: 32px;
                   position: relative;
                   cursor: ${isUnlocked ? 'pointer' : 'default'};
                   filter: ${isUnlocked ? 'none' : 'grayscale(100%)'};
                 ">
              ${skill.icon}
              ${isUnlocked ? `
                <div style="
                  position: absolute; 
                  bottom: -15px; 
                  right: -15px; 
                  background: var(--color-warning); 
                  border-radius: 50%; 
                  width: 30px; 
                  height: 30px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  font-size: 14px; 
                  font-weight: bold; 
                  color: white; 
                  border: 2px solid white;
                  box-shadow: 0 2px 0 var(--color-warning-shadow);">
                  ${crowns}
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
    });

    container.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; height: 60px; background: var(--color-bg); z-index: 100; border-bottom: 2px solid var(--color-gray-200); display: flex; align-items: center; padding: 0 var(--spacing-4); justify-content: space-between;">
        <div class="flex-center gap-2">
          <span style="font-size: 24px;">${lang === 'tamil' ? 'த' : lang === 'telugu' ? 'తె' : lang === 'kannada' ? 'ಕ' : 'മ'}</span>
        </div>
        <div class="flex-center gap-4">
          <div class="flex-center gap-2" style="color: var(--color-warning); font-weight: 800;">
            🔥 ${state.data.user.streak}
          </div>
          <div class="flex-center gap-2" style="color: var(--color-danger); font-weight: 800;">
            ❤️ ${state.data.user.hearts}
          </div>
        </div>
      </div>

      <div class="screen" style="padding-top: 80px; padding-bottom: 100px; display: flex; flex-direction: column;">
        ${itemsHtml}
      </div>
      
      ${renderNavbar('home')}
    `;

    attachNavbarListeners();

    document.querySelectorAll('.skill-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const isUnlocked = e.currentTarget.dataset.unlocked === 'true';
        const skillId = e.currentTarget.dataset.skill;
        if (isUnlocked) {
          router.navigate(`/lesson/${skillId}`);
        }
      });
    });

    unsubscribe = state.subscribe(() => {
      mount(); // re-render on state change
    });
  };

  const unmount = () => {
    if (unsubscribe) unsubscribe();
  };

  return { mount, unmount };
}
