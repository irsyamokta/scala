import '../css/app.css';
import './bootstrap';

import { useEffect, type ComponentType } from "react";
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import AOS from "aos";
import "aos/dist/aos.css";

type AppWrapperProps = {
    App: ComponentType<any>;
    props: any;
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const parts = name.split('/');
        const feature = parts[0].toLowerCase();
        const path = parts.slice(1).join('/');
        return resolvePageComponent(
            `./features/${feature}/pages/${path}.tsx`,
            import.meta.glob('./features/**/*.tsx'),
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: false,
        });

        function AppWrapper({ App, props }: AppWrapperProps) {
            useEffect(() => {
                AOS.refresh();
            });

            return <App {...props} />;
        }

        root.render(
            <>
                <AppWrapper App={App} props={props} />
                <Toaster
                    richColors
                    duration={3000}
                />
            </>
        );
    },
    progress: {
        color: '#0C968D',
    },
});
