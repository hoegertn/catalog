import * as testee from '../SearchApi';

beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                {name: 'cdk-gitlab-source', version: '1.0.0', description: 'Construct to use GitLab as CodePipeline Source'},
                {name: 'cdk-es-domain', version: '0.0.12', description: 'Construct to set up an ElasticSearch domain', keywords: ['elastic', 'indexer']},
                {name: 'cdk-spa-deploy', version: '1.80.3', description: 'Some cool construct to deploy SPAs to S3'},
            ]),
        })
    );
});

test('simple query test', async () => {
    const result = await testee.searchByQuery('deploy');

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('cdk-spa-deploy');
});

test('with multiple results', async () => {
    const result = await testee.searchByQuery('SPA');

    expect(result.length).toBe(2); // Will find "... Set uP An ..."
    expect(result[0].name).toBe('cdk-spa-deploy'); // Will sort by best match
});

test('with keyword hit', async () => {
    const result = await testee.searchByQuery('index');

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('cdk-es-domain');
});

test('handle error', async () => {
    const errorMessage = 'Failed to parse JSON';
    console.error = jest.fn();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.reject(errorMessage),
        })
    );
    const result = await testee.searchByQuery('index');

    expect(result.length).toBe(0);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(errorMessage);
});
