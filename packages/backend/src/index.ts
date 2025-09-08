/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { stringifyEntityRef } from '@backstage/catalog-model'

// -----------------------------------s------------------------------------------
// Define custom GitHub auth resolver FIRST
// -----------------------------------------------------------------------------
const customAuthResolver = createBackendModule({
  pluginId: 'auth', // must target "auth"
  moduleId: 'custom-auth-provider', // unique ID for this module
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'github', // matches auth.providers.github
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver(info, ctx) {
              console.log("DEBUG: GitHub signInResolver");
              console.log(info);

              const { profile, result } = info;

              // Try email first
              let email = profile.email;

              // If email is missing (private in GitHub), fall back to username
              if (!email) {
                const username = result.fullProfile.username;
                email = `${username}@users.noreply.github.com`;
              }

              const [userId] = email.split('@');
                // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
              const userEntity = stringifyEntityRef({
                kind: 'User',
                name: userId,
                namespace: 'default',
              });

              return ctx.issueToken({
                claims: {
                  sub: userEntity,
                  ent: [userEntity],
                },
              });
            },
          }),
        });
      },
    });
  },
});

// -----------------------------------------------------------------------------
// Build backend
// -----------------------------------------------------------------------------
const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-notifications'));

// techdocs plugin
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(customAuthResolver); // ✅ only once, after base auth

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(import('@backstage/plugin-permission-backend-module-allow-all-policy'));

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes plugin
backend.add(import('@backstage/plugin-kubernetes-backend'));

// notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

backend.start();
