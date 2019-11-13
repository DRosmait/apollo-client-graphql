import 'cross-fetch/polyfill';
import ApolloClient from 'apollo-boost';

import 'dotenv/config';

const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    reques: operetion => {
        operetion.setContext({
            headers: {
                authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            }
        });
    },
});

const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };

const user = {
  ...userCredentials,
  ...userDetails,
};

console.log(user);

console.log(process.env.SOME_ENV_VARIABLE);
