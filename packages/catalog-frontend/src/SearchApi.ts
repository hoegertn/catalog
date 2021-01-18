import FuzzySearch from 'fuzzy-search';

export interface ConstructPackage {
    name: string;
    version: string;
    description: string;
    keywords: string[];
}

export async function searchByQuery(query: string): Promise<ConstructPackage[]> {
    return fetch('/packages/index.json') // TODO replace with correct path
        .then((response) => response.json())
        .then((list: ConstructPackage[]) => {
            const searcher = new FuzzySearch(list, ['name', 'description', 'keywords'], {sort: true});
            return searcher.search(query);
        }, (err) => {
            console.error(err);
            return [];
        });
}