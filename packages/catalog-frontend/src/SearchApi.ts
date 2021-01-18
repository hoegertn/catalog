import FuzzySearch from 'fuzzy-search';

export interface ConstructPackage {
    name: string;
    version: string;
    metadata: {
        name: string;
        scope: string;
        version: string;
        description: string;
        keywords: string[];
        date: string;
        author: {
            name: string;
        },
    },
    url: string;
}

export async function searchByQuery(query: string): Promise<ConstructPackage[]> {
    return fetch('/index/packages.json')
        .then((response) => response.json())
        .then((list: ConstructPackage[]) => {
            const searcher = new FuzzySearch(list, ['name', 'metadata.description', 'metadata.keywords', 'metadata.author.name'], { sort: true });
            return searcher.search(query);
        }, (err) => {
            console.error(err);
            return [];
        });
}