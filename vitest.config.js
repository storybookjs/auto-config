import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        passWithNoTests: true,
        reporters: 'verbose',
        setupFiles: ['./vitest.setup.js'],
    },
});
