import { state } from './state.js';

export const router = {
  routes: {},
  appContainer: null,
  currentView: null,

  init(containerId) {
    this.appContainer = document.getElementById(containerId);
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  addRoute(path, viewFunction) {
    this.routes[path] = viewFunction;
  },

  navigate(path) {
    window.location.hash = path;
  },

  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    // Match route with params support (very basic)
    let matchedRoute = this.routes[hash];
    let routeParams = {};

    if (!matchedRoute) {
      // try to match dynamic routes like /lesson/:id
      for (const [routePath, viewBox] of Object.entries(this.routes)) {
        const routeParts = routePath.split('/');
        const hashParts = hash.split('/');

        if (routeParts.length === hashParts.length) {
          let match = true;
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              routeParams[routeParts[i].substring(1)] = hashParts[i];
            } else if (routeParts[i] !== hashParts[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            matchedRoute = viewBox;
            break;
          }
        }
      }
    }

    if (matchedRoute) {
      // Cleanup previous view if needed
      if (this.currentView && this.currentView.unmount) {
        this.currentView.unmount();
      }

      this.appContainer.innerHTML = ''; // Clear container

      const view = matchedRoute(this.appContainer, routeParams);
      this.currentView = view;
      if (view && view.mount) {
        await view.mount();
      }
    } else {
      this.appContainer.innerHTML = '<h2>404 - Not Found</h2><a href="#/">Go Home</a>';
    }
  }
};
