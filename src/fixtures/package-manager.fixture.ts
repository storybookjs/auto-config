import { JsPackageManager } from '@storybook/cli';

export default {
    getAllDependencies: () => Promise.resolve({}),
    addDependencies: (options, deps) => Promise.resolve(),
} as JsPackageManager;
