import React from 'react';
import {defaultMemoize} from 'reselect';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// We need to memoize configuration and global registry; otherwise a new object is created at every render; leading to
// LOADS of unnecessary re-draws.
const buildConfigurationAndGlobalRegistry = defaultMemoize((configuration: {}, globalRegistry: GlobalRegistry, routes: {}) => ({configuration, globalRegistry, routes}));

export interface NeosContextInterface {
    globalRegistry: GlobalRegistry;
    configuration: {};
    routes: {};
}

export const NeosContext = React.createContext<NeosContextInterface | null>(null);

//
// A higher order component to easily spread global
// configuration
//
export default <
    P extends {
        neos?: NeosContextInterface;
    },
    R = Omit<P, 'neos'>
    >(mapRegistriesToProps: (globalRegistry: GlobalRegistry) => {}) => (WrappedComponent: React.ComponentType<P>) => {
    const Decorator = class NeosDecorator extends React.PureComponent<R> {
        public static readonly Original = WrappedComponent;

        public static readonly contextType = NeosContext;

        public static readonly displayName = `Neos(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        public render(): JSX.Element {
            return (
                <NeosContext.Consumer>
                    {context => {
                        if (!context) {
                            // This could happen during initialization
                            return null;
                        }
                        const registriesToPropsMap = mapRegistriesToProps ? mapRegistriesToProps(context.globalRegistry) : {};
                        return (
                            <WrappedComponent
                                neos={buildConfigurationAndGlobalRegistry(context.configuration, context.globalRegistry, context.routes)}
                                {...this.props}
                                {...registriesToPropsMap}
                                />
                        );
                    }}
                </NeosContext.Consumer>
            );
        }
    };
    return Decorator;
};
