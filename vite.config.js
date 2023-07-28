import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(
  {
    plugins: [
      preact()
    ],

    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
      // watch: {
      //   exclude: ["node_modules/**"],
      //   include: ["src/**"],
      // },
    },
  }
  // ({ command, mode }) => {
  //   const env = loadEnv(mode, process.cwd(), "");
  //   return {
  //     define: {
  //       "process.env.YOUR_STRING_VARIABLE": JSON.stringify(
  //         env.YOUR_STRING_VARIABLE
  //       ),
  //       "process.env.YOUR_BOOLEAN_VARIABLE": env.YOUR_BOOLEAN_VARIABLE,
  //       // If you want to exposes all env variables, which is not recommended
  //       // 'process.env': env
  //     },
  //   };
  // }
);

// export default defineConfig(({ command, mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//   return {
//     define: {
//       "process.env.YOUR_STRING_VARIABLE": JSON.stringify(
//         env.YOUR_STRING_VARIABLE
//       ),
//       "process.env.YOUR_BOOLEAN_VARIABLE": env.YOUR_BOOLEAN_VARIABLE,
//       // If you want to exposes all env variables, which is not recommended
//       // 'process.env': env
//     },
//   };
// });
