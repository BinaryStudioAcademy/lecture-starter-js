import { defineConfig } from 'vite';

const config = () => {
    return defineConfig({
        server: {
            host: 'localhost',
            port: 7600
        }
    });
};

export default config;
