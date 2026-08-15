// Shared TanStack Query key prefix for anything backed by the vocab_list
// table — invalidating this prefix catches both the membership map used by
// AddToVocabButton and the full entries list used by the vocab-list feature.
export const VOCAB_LIST_QUERY_PREFIX = ['vocab-list']
