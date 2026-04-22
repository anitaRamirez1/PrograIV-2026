import { createApp } from 'vue';
import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Empresas from './components/Empresas.vue';
import Pasantias from './components/Pasantias.vue';

const app = createApp({
    components: {
        Empresas,
        Pasantias
    },
    data() {
        return {
            currentTab: 'empresas' // Tab por default
        }
    },
    template: `
        <div class="container py-5">
            <div class="text-center mb-5">
                <h1 class="fw-bold text-blue mb-2"><i class="fas fa-handshake"></i> Plataforma de Vinculación</h1>
                <p class="text-muted fs-5">Gestor de Oportunidades y Empresas Registradas</p>
            </div>
            
            <ul class="nav nav-tabs justify-content-center mb-4 border-0">
                <li class="nav-item">
                    <a class="nav-link tab-custom" :class="{active: currentTab === 'empresas'}" href="#" @click.prevent="currentTab = 'empresas'">
                        <i class="fas fa-building me-2"></i> Módulo Empresas
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link tab-custom" :class="{active: currentTab === 'pasantias'}" href="#" @click.prevent="currentTab = 'pasantias'">
                        <i class="fas fa-briefcase me-2"></i> Módulo Pasantías
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <!-- Efecto fadeIn suave -->
                <transition mode="out-in" name="fade">
                    <Empresas v-if="currentTab === 'empresas'" />
                </transition>
                <transition mode="out-in" name="fade">
                    <Pasantias v-if="currentTab === 'pasantias'" />
                </transition>
            </div>
        </div>
    `
});

app.mount('#app');
