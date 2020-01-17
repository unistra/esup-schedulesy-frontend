import store from '@/store/store';
import Vuetify from '@/plugins/vuetify';

const checkUserCustomizationLoaded = (to, from, next) => {
  const proceed = () => {
    if (store.state.config.isUserCustomizationLoaded) {
      if (to.name !== 'home') {
        next();
      } else if (!store.state.config.userCustomization.resources) {
        next({ name: 'config' });
      } else if (Vuetify.framework.breakpoint.smAndDown
                 && !!store.state.config.userCustomization.configuration
                 && 'displayMode' in store.state.config.userCustomization.configuration
                 && store.state.config.userCustomization.configuration.displayMode === 'list') {
        next({ name: 'list' });
      } else {
        next({ name: 'calendar' });
      }
    }
  };
  if (!store.state.config.isUserCustomizationLoaded
    && !store.state.auth.isUuidLoaded) {
    store.watch(
      state => state.config.isUserCustomizationLoaded && store.state.auth.isUuidLoaded,
      (value) => {
        if (value === true) {
          proceed();
        }
      },
    );
  } else {
    proceed();
  }
};

const loadUserEvents = (to, from, next) => {
  store.dispatch('calendar/loadUserEvents')
    .then(() => {
      next();
    })
    .catch((error) => {
      if (error.response.status === 413) {
        store.dispatch('ui/updateSnackbar', {
          isVisible: true,
          color: 'warning',
          message: 'Limite d\'évènements à afficher atteinte. Veuillez sélectionner moins de ressources',
          timeout: 6000,
        });
        next({ name: 'config' });
      }
    });
};

const checkUserEventsLoaded = (to, from, next) => {
  const proceed = () => {
    if (store.state.calendar.areUserEventsLoaded) {
      next();
    }
  };
  if (!store.state.calendar.areUserEventsLoaded) {
    store.watch(
      state => state.calendar.areUserEventsLoaded,
      (value) => {
        if (value === true) {
          proceed();
        }
      },
    );
  } else {
    proceed();
  }
};

export { loadUserEvents, checkUserCustomizationLoaded, checkUserEventsLoaded };
