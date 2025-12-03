/**
 * @author Brett Jurgens
 * Code found in link below
 * https://medium.com/@brettjurgens/graphql-typescript-strongly-typed-api-responses-f8aea1e81b93
 */

export interface IGraphQLResponseError {
    message: string; 
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: unknown;
}

export interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
}