import { state } from '../state.js';
import { router } from '../router.js';
import { questionsBank } from '../data/curriculum.js';
import { renderQuestion } from '../components/questionTypes.js';

export default function createLessonScreen(container, params) {
  let skillId = params && params.id ? params.id : 'basics_1';
  let lang = state.data.currentLanguage;

  // Refill hearts at the start of each lesson
  state.data.user.hearts = 5;
  state.save();

  let rawQuestions = questionsBank[`${lang}_${skillId}`] || [];

  // Deduplicate questions by text to ensure semantic uniqueness
  const seen = new Set();
  let questions = rawQuestions.filter(q => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });

  // Fisher-Yates shuffle to randomize question order
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  if (questions.length === 0) {
    // If no questions exist for this skill, show a message instead of a placeholder
    container.innerHTML = `
      <div class="screen flex-center flex-col" style="padding: 40px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">🚧</div>
        <h2>Coming Soon!</h2>
        <p style="color: var(--color-gray-400);">This lesson is still being prepared. Check back later!</p>
        <button id="btn-back-home" class="btn btn-primary" style="margin-top: 20px; max-width: 300px;">GO BACK</button>
      </div>
    `;
    document.getElementById('btn-back-home').addEventListener('click', () => {
      router.navigate('/home');
    });
    return { mount: () => { }, unmount: () => { } };
  }

  let currentIndex = 0;
  let correctAnswers = 0;
  let hasAnsweredCurrent = false;
  let lastResult = false;

  const mount = () => {
    if (currentIndex >= questions.length) {
      renderSummary();
      return;
    }

    const question = questions[currentIndex];
    const progressPercent = (currentIndex / questions.length) * 100;

    container.innerHTML = `
      <div class="screen" style="padding: 0; display: flex; flex-direction: column;">
        
        <div style="padding: 20px; display: flex; align-items: center; gap: 20px;">
          <div id="btn-close" style="font-size: 24px; color: var(--color-gray-300); cursor: pointer; font-weight: bold;">✕</div>
          <div style="flex: 1; height: 16px; background: var(--color-gray-200); border-radius: 8px; overflow: hidden;">
            <div style="width: ${progressPercent}%; height: 100%; background: var(--color-primary); border-radius: 8px; transition: width 0.3s ease;"></div>
          </div>
          <div style="color: var(--color-danger); font-weight: 800; display: flex; align-items: center; gap: 4px;">
            ❤️ ${state.data.user.hearts}
          </div>
        </div>

        <div id="question-container" style="padding: 0 20px; flex: 1;">
          <!-- Question inserted here -->
        </div>

        <div id="footer" style="padding: 20px; border-top: 2px solid var(--color-gray-200); background: var(--color-bg);">
          <button id="btn-check" class="btn btn-disabled" disabled>CHECK</button>
        </div>

      </div>
    `;

    document.getElementById('btn-close').addEventListener('click', () => {
      if (confirm('Quit lesson? Progress will be lost.')) {
        router.navigate('/home');
      }
    });

    const qContainer = document.getElementById('question-container');
    const checkBtn = document.getElementById('btn-check');
    const footer = document.getElementById('footer');

    renderQuestion(question, qContainer, (isCorrect) => {
      // Once selection is made, enable check button
      hasAnsweredCurrent = true;
      lastResult = isCorrect;
      checkBtn.classList.remove('btn-disabled');
      checkBtn.classList.add('btn-primary');
      checkBtn.removeAttribute('disabled');
    });

    checkBtn.addEventListener('click', () => {
      if (!hasAnsweredCurrent) return;

      if (lastResult) {
        correctAnswers++;
        footer.style.backgroundColor = '#d7ffb8';
        footer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="color: var(--color-primary-shadow); font-weight: 900; font-size: 24px; display: flex; align-items: center; gap: 10px;">
              <span style="background: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">✅</span> Good job!
            </div>
            <button id="btn-continue" class="btn btn-primary">CONTINUE</button>
          </div>
        `;
      } else {
        state.useHeart();
        footer.style.backgroundColor = '#ffdfdf';
        footer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="color: var(--color-danger-shadow); font-weight: 900; font-size: 24px; display: flex; align-items: center; gap: 10px;">
              <span style="background: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">❌</span> Incorrect
            </div>
            <button id="btn-continue" class="btn btn-danger">CONTINUE</button>
          </div>
        `;
      }

      document.getElementById('btn-continue').addEventListener('click', () => {
        currentIndex++;
        hasAnsweredCurrent = false;
        mount();
      });
    });
  };

  const renderSummary = () => {
    const xpEarned = correctAnswers * 10 + 10; // bonus
    state.completeLesson(skillId, xpEarned);

    // Refill hearts after completing a lesson
    state.data.user.hearts = 5;
    state.save();

    container.innerHTML = `
      <div class="screen flex-center flex-col animate-slide-up" style="background-color: var(--color-bg); padding: 40px;">
        <h2 style="color: var(--color-warning); font-size: 32px; text-align: center; margin-bottom: 40px;">Lesson Complete!</h2>
        
        <div class="flex-row gap-4" style="margin-bottom: 40px;">
          <div class="card" style="border-color: var(--color-warning); background: #fffdf0; display: flex; flex-direction: column; align-items: center; width: 100px;">
            <div style="font-size: 14px; font-weight: bold; color: var(--color-warning); text-transform: uppercase;">Total XP</div>
            <div style="font-size: 24px; font-weight: 900; color: var(--color-warning-shadow);">+${xpEarned}</div>
          </div>
          <div class="card" style="border-color: var(--color-primary); background: #e6fff9; display: flex; flex-direction: column; align-items: center; width: 100px;">
            <div style="font-size: 14px; font-weight: bold; color: var(--color-primary); text-transform: uppercase;">Accuracy</div>
            <div style="font-size: 24px; font-weight: 900; color: var(--color-primary-shadow);">${Math.round((correctAnswers / questions.length) * 100)}%</div>
          </div>
        </div>
        
        <button id="btn-finish" class="btn btn-primary" style="margin-top: auto;">CONTINUE</button>
      </div>
    `;

    document.getElementById('btn-finish').addEventListener('click', () => {
      router.navigate('/home');
    });
  };

  const unmount = () => {
    // cleanup
  };

  return { mount, unmount };
}
