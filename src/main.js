import { createApp } from 'vue';
import App from '@/App';
import router from '@/router/router';
import { createPinia } from 'pinia';

import './css/styles.css';
import './css/animations.css';

const pinia = createPinia();

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app');