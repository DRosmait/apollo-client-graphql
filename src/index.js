import 'dotenv/config';
import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    request: operetion => {
        operetion.setContext({
            headers: {
                authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            }
        });
    },
});

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
    query ($organization: String!, $cursor: String) {
        organization(login: $organization) {
            name
            url
            repositories(first: 5, after: $cursor, orderBy: { field: STARGAZERS, direction: DESC }) {
                edges {
                    node {
                        ...RepositoryFrag
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }

    fragment RepositoryFrag on Repository {
        name
        url
        stargazers {
            totalCount
        }
    }
`;

const ADD_STAR = gql`
    mutation AddStar($repositoryId: ID!) {
        addStar(input: { starrableId: $repositoryId}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`;

const REMOVE_STAR = gql`
    mutation RemoveStar($repositoryId: ID!) {
        removeStar(input: { starrableId: $repositoryId }) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`

// client
//     .query({
//         query: GET_REPOSITORIES_OF_ORGANIZATION,
//         variables: {
//             organization: 'the-road-to-learn-react',
//         }
//     })
//     .then(({ data }) => {
//         console.log(data.organization.repositories.edges.map(r => r.node));

//         const { endCursor: cursor } = data.organization.repositories.pageInfo;

//         return client.query({
//             query: GET_REPOSITORIES_OF_ORGANIZATION,
//             variables: {
//                 organization: 'the-road-to-learn-react',
//                 cursor,
//             },
//         });
//     })
//     .then(({ data }) => console.log(data.organization.repositories.edges.map(r => r.node)));

client
    .mutate({
        mutation: ADD_STAR,
        variables: { repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==', }
    })
    .then(data => data.data.addStar.starrable)
    .then(starrable => {
        console.log(starrable);

        return client
            .mutate({
                mutation: REMOVE_STAR,
                variables: { repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==', },
            });
    })
    .then(data => data.data.removeStar.starrable)
    .then(console.log);