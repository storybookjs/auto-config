import { JsPackageManager } from '@storybook/cli';

export default {
    getAllDependencies: () => Promise.resolve({}),
} as JsPackageManager;
