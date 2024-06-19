import { createApp } from 'vue';
import App from '@/App';
import router from '@/router/router';

import './css/styles.css';
import './css/animations.css';

createApp(App).use(router).mount('#app');