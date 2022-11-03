import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import fetch from 'cross-fetch';
import { getMediaSourceType } from 'livepeer/media';
import { parseArweaveTxId, parseCid } from 'livepeer/media/storage';

import {
  ExplorePublicationRequest,
  ExplorePublicationsDocument,
  Post,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
} from './lens-graphql/generated';
import {
  MediaType,
  VideoNftsDocument,
  VideoNftsQueryVariables,
} from './zora-graphql/generated';
import fs from 'fs';

const NUM_POSTS = 5000;

type CombinedMedia = {
  url: string;
  mimeType: string;
  isDStorage: boolean;
  source: 'zora' | 'lens';
};

let urlSet = new Set<string>();

export const getLensVideoPublications = async () => {
  const httpLink = new HttpLink({
    uri: 'https://api.lens.dev',
    fetch,
  });

  const client = new ApolloClient({
    link: from([new RetryLink(), httpLink]),
    cache: new InMemoryCache(),
  });

  const allMedia: CombinedMedia[] = [];

  const batch = 50;
  let cursor: string | undefined = undefined;

  while (allMedia.length < NUM_POSTS) {
    const request: ExplorePublicationRequest = {
      limit: batch,
      ...(cursor ? { cursor } : {}),

      publicationTypes: [PublicationTypes.Post],
      sortCriteria: PublicationSortCriteria.Latest,
      metadata: {
        mainContentFocus: [PublicationMainFocus.Video],
      },
    };
    const result = await client.query({
      query: ExplorePublicationsDocument,
      variables: {
        request,
      },
    });

    const posts = result.data.explorePublications.items
      .filter((item) => item.__typename === 'Post')
      .map((item) => item as Post);

    const medias = posts
      .flatMap((post) => post.metadata.media)
      .map((media) => media.original);

    const ipfsOrArweaveMedia = medias
      .map((media) =>
        media?.url
          ? parseCid(media.url)?.url ?? parseArweaveTxId(media.url)?.url
            ? {
                mimeType: String(media.mimeType),
                url:
                  parseCid(media.url)?.url ?? parseArweaveTxId(media.url)?.url,
                isDStorage: true,
              }
            : {
                mimeType: String(media.mimeType),
                url: String(media.url),
                isDStorage: false,
              }
          : null,
      )
      .filter((media) => media?.url)
      .map((media) => ({
        mimeType: media!.mimeType!,
        url: media!.url!,
        isDStorage: media!.isDStorage!,
        source: 'lens' as const,
      }))
      .filter((media) => !urlSet.has(media.url))
      .filter((media) => !media.url.includes('livepeer'))
      .map((media) => ({
        ...media,
        url: media.url.replace('ipfs.infura.io', 'infura-ipfs.io'),
      }));

    allMedia.push(...ipfsOrArweaveMedia);
    urlSet = new Set([...urlSet, ...ipfsOrArweaveMedia.map((e) => e.url)]);

    cursor = result.data.explorePublications.pageInfo.next;

    console.log('lens', allMedia.length);
  }

  return allMedia;
};

export const getZoraVideoNfts = async () => {
  const httpLink = new HttpLink({
    uri: 'https://api.zora.co/graphql',
    fetch,
  });

  const client = new ApolloClient({
    link: from([new RetryLink(), httpLink]),
    cache: new InMemoryCache(),
  });

  const allMedia: CombinedMedia[] = [];

  const batch = 50;
  let cursor: string | undefined = undefined;

  while (allMedia.length < NUM_POSTS) {
    const variables: VideoNftsQueryVariables = {
      pagination: {
        limit: batch,
        ...(cursor ? { after: cursor } : {}),
      },
      filter: {
        mediaType: MediaType.Video,
      },
    };
    const result = await client.query({
      query: VideoNftsDocument,
      variables,
    });

    const nfts = result.data.tokens.nodes
      .map((node) => node.token)
      .map((token) =>
        token.image?.mimeType?.includes('video/') && token.image.url
          ? {
              url: token.image.url!,
              mimeType: token.image.mimeType!,
            }
          : getMediaSourceType(token.metadata.animation_url)?.type === 'video'
          ? {
              url: token.metadata.animation_url,
              mimeType: getMediaSourceType(token.metadata.animation_url)!.mime,
            }
          : null,
      )
      .filter((image) => image?.mimeType?.includes('video/'));

    const ipfsOrArweaveMedia = nfts
      .map((media) =>
        media?.url
          ? parseCid(media.url)?.url ?? parseArweaveTxId(media.url)?.url
            ? {
                mimeType: String(media.mimeType),
                url:
                  parseCid(media.url)?.url ?? parseArweaveTxId(media.url)?.url,
                isDStorage: true,
              }
            : {
                mimeType: String(media.mimeType),
                url: String(media.url),
                isDStorage: false,
              }
          : null,
      )
      .filter((media) => media?.url)
      .map((media) => ({
        mimeType: media!.mimeType!,
        url: media!.url!,
        isDStorage: media!.isDStorage!,
        source: 'zora' as const,
      }))
      .filter((media) => !urlSet.has(media.url))
      .filter((media) => !media.url.includes('livepeer'))
      .map((media) => ({
        ...media,
        url: media.url.replace('ipfs.infura.io', 'infura-ipfs.io'),
      }));

    allMedia.push(...ipfsOrArweaveMedia);
    urlSet = new Set([...urlSet, ...ipfsOrArweaveMedia.map((e) => e.url)]);

    cursor = result.data.tokens.pageInfo.endCursor ?? undefined;

    console.log('zora', allMedia.length);
  }

  return allMedia;
};

(async () => {
  const zora = await getZoraVideoNfts();
  const lens = await getLensVideoPublications();

  const merged: CombinedMedia[] = [...lens, ...zora];

  // shuffle the array
  for (let i = merged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = merged[i];
    merged[i] = merged[j];
    merged[j] = temp;
  }

  fs.writeFileSync('output.json', JSON.stringify(merged, null, 2));
})().then(() => console.log('Done!'));
