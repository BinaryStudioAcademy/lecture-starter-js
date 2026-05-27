import { defineConfig } from 'vite';

const config = () => {
    return defineConfig({
        server: {
            host: 'localhost',
            port: 7800
        },
        test: {
            environment: 'node'
        }
    });
};

export default config;
