import { ref, computed } from 'vue';
import { watch } from 'vue';

const count = ref(0);
const message = ref('Processando...');

let listenerAttached = false;

function handleBeforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
}

const isLoading = computed(() => count.value > 0);

watch(isLoading, (val) => {
    if (val && !listenerAttached) {
        window.addEventListener('beforeunload', handleBeforeUnload);
        listenerAttached = true;
    } else if (!val && listenerAttached) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        listenerAttached = false;
    }
});

export function useLoading() {


    function start(msg = 'Processando...') {
        message.value = msg;
        count.value++;
    }

    function stop() {
        count.value = Math.max(0, count.value -1);
    }

    async function withLoading<T>(fn: () => Promise<T>, msg?: string): Promise<T> {
        start(msg);

        try {
            return await fn();
        } finally {
            stop();
        }
    }

    return { isLoading, message, start, stop, withLoading };
}