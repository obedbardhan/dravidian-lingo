import './index.css';
import { state } from './state.js';
import { router } from './router.js';

// Screens
import createLandingScreen from './screens/landing.js';
import createHomeScreen from './screens/home.js';
import createLessonScreen from './screens/lesson.js';
import createProfileScreen from './screens/profile.js';
import createLeaderboardScreen from './screens/leaderboard.js';
import createShopScreen from './screens/shop.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize state from local storage
  state.init();

  // Initialize router
  router.init('app');

  // Register routes
  router.addRoute('/', createLandingScreen);
  router.addRoute('/home', createHomeScreen);
  router.addRoute('/lesson/:id', createLessonScreen);
  router.addRoute('/profile', createProfileScreen);
  router.addRoute('/leaderboard', createLeaderboardScreen);
  router.addRoute('/shop', createShopScreen);

  // Start up based on state
  if (!state.data.currentLanguage) {
    router.navigate('/');
  } else if (!window.location.hash || window.location.hash === '#/') {
    router.navigate('/home');
  } else {
    router.handleRoute(); // handles current hash
  }
});
