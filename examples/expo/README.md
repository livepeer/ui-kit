# expo

This example demonstrates how livepeer.js can be used in a social media mobile application, **with automatic short-form video optimization to allow near-instant media playback**. It uses [Preconstruct](https://github.com/preconstruct/preconstruct) to set up local links between packages.

To get started, in the root of livepeer.js, run:

```bash
pnpm i # this may fail due to missing Podfile dependencies, can be ignored
cd examples/expo/
pnpm dev
```

## Components

### VideoUpload

[`VideoUpload`](./components/VideoUpload.tsx) is a simple component which is fixed at the top of the mobile app and demonstrates the use of `useCreateAsset` alongside [`expo-image-picker`](https://docs.expo.dev/versions/latest/sdk/imagepicker/).

The VideoUpload button launches a image library picker (which only allows videos to be selected), then allows the user to upload the asset to the Livepeer network to be transcoded. The `useCreateAsset` automatically polls the API in the background to check on the upload & transcode status:

https://user-images.githubusercontent.com/32714304/219115764-eb16167e-5993-4038-b070-02b12019626b.mov

### VideoList

The [`VideoList`](./components/VideoList.tsx) component uses `usePlayerList` to preload and display videos in a [`FlatList`](https://reactnative.dev/docs/flatlist)-compatible list, by using [`viewabilityConfigCallbackPairs`](https://reactnative.dev/docs/flatlist#viewabilityconfigcallbackpairs) to trigger preloading on upcoming videos, and automatically play/pause video when it is shown/hidden from the list:

https://user-images.githubusercontent.com/32714304/219115209-2a395f05-5bc5-45c4-9d60-d484da269ddb.mov
