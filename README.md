# `@storybook/auto-config`

An **🧪 experimental 🧪** collection of codemods to automatically configure (auto-config) addons in Storybook 7.

Currently we support auto-config for the following addons

-   [`@storybook/addon-styling-webpack`](https://github.com/storybookjs/addon-styling-webpack)
-   [`@storybook/addon-themes`](https://github.com/storybookjs/storybook/tree/next/code/addons/themes)

## Usage

Run the following command in the parent directory of your `.storybook/` folder.

**For PNPM**

```sh
pnpm dlx @storybook/auto-config COMMAND
```

**For Yarn**

```sh
yarn dlx @storybook/auto-config COMMAND
```

**For NPM**

```sh
npx @storybook/auto-config COMMAND
```

### Commands

-   **Styling**: Runs the auto-config script for `@storybook/addon-styling-webpack`
    -   Example:
        ```
        pnpm dlx @storybook/auto-config styling
        ```
-   **Themes**: Runs the auto-config script for `@storybook/addon-styling-webpack`
    -   Example:
        ```
        pnpm dlx @storybook/auto-config themes
        ```
