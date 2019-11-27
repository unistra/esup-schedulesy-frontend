// import './setup';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import UnistraSchedule from '@/UnistraSchedule.vue';

const { expect } = chai;
chai.use(sinonChai);

console.log('IN UNISTRASCHEDULE UNIT TESTS FILE');
console.log(process.env.NODE_ENV);

const localVue = createLocalVue();
localVue.use(Vuex);


describe('UnistraSchedule', () => {
  let vuetify;
  let store;
  let config;
  const fakeUserCustomization = {
    configuration: {
      darkMode: true,
    },
  };
  const loadUserCustomization = sinon.fake.returns(fakeUserCustomization);

  beforeEach(() => {
    vuetify = new Vuetify();
    config = {
      namespaced: true,
      actions: {
        loadUserCustomization,
      },
    };
    store = new Vuex.Store({
      modules: {
        config,
      },
    });
  });

  it('is named UnistraSchedule', () => {
    expect(UnistraSchedule.name).to.equal('UnistraSchedule');
  });

  it('has the `created` hook', () => {
    expect(UnistraSchedule.created).to.be.a('function');
  });

  it('should call loadUserCustomization when created', () => {
    const wrapper = shallowMount(UnistraSchedule, {
      localVue,
      vuetify,
      store,
      stubs: ['router-view'],
    });
    expect(loadUserCustomization).to.have.been.calledOnce;
  });
});
