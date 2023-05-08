import type { Meta, StoryObj } from '@storybook/react';
import { CompactTable } from '~/pages/search';

import type { Track } from '~/types/spotify-types';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof CompactTable> = {
  title: 'SearchResult',
  component: CompactTable,
  tags: ['autodocs'],
  argTypes: {
    data: []
  },
};

export default meta;
type Story = StoryObj<typeof CompactTable>;

const ExampleTracks = [
  {
    "album": {
      "album_type": "SINGLE",
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/33EUXrFKGjpUSGacqEHhU4"
          },
          "href": "https://api.spotify.com/v1/artists/33EUXrFKGjpUSGacqEHhU4",
          "id": "33EUXrFKGjpUSGacqEHhU4",
          "name": "Iggy Pop",
          "type": "artist",
          "uri": "spotify:artist:33EUXrFKGjpUSGacqEHhU4"
        }
      ],

      "external_urls": {
        "spotify": "https://open.spotify.com/album/4qHxDHh1Go7ZR6d8fPC2Pd"
      },
      "href": "https://api.spotify.com/v1/albums/4qHxDHh1Go7ZR6d8fPC2Pd",
      "id": "4qHxDHh1Go7ZR6d8fPC2Pd",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/ab67616d0000b273005a96aa94df4e7f21139152",
          "width": 640
        },
        {
          "height": 300,
          "url": "https://i.scdn.co/image/ab67616d00001e02005a96aa94df4e7f21139152",
          "width": 300
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/ab67616d00004851005a96aa94df4e7f21139152",
          "width": 64
        }
      ],
      "name": "Lust For Life (The Prodigy Remix)",
      "release_date": "2017-08-04",
      "release_date_precision": "day",
      "total_tracks": 1,
      "type": "album",
      "uri": "spotify:album:4qHxDHh1Go7ZR6d8fPC2Pd"
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/33EUXrFKGjpUSGacqEHhU4"
        },
        "href": "https://api.spotify.com/v1/artists/33EUXrFKGjpUSGacqEHhU4",
        "id": "33EUXrFKGjpUSGacqEHhU4",
        "name": "Iggy Pop",
        "type": "artist",
        "uri": "spotify:artist:33EUXrFKGjpUSGacqEHhU4"
      },
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/4k1ELeJKT1ISyDv8JivPpB"
        },
        "href": "https://api.spotify.com/v1/artists/4k1ELeJKT1ISyDv8JivPpB",
        "id": "4k1ELeJKT1ISyDv8JivPpB",
        "name": "The Prodigy",
        "type": "artist",
        "uri": "spotify:artist:4k1ELeJKT1ISyDv8JivPpB"
      },
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/3UKIiIkOIj6NEzAPClAM3t"
        },
        "href": "https://api.spotify.com/v1/artists/3UKIiIkOIj6NEzAPClAM3t",
        "id": "3UKIiIkOIj6NEzAPClAM3t",
        "name": "Liam Howlett",
        "type": "artist",
        "uri": "spotify:artist:3UKIiIkOIj6NEzAPClAM3t"
      }
    ],

    "disc_number": 1,
    "duration_ms": 300133,
    "explicit": false,
    "external_ids": {
      "isrc": "QMS371600001"
    },
    "external_urls": {
      "spotify": "https://open.spotify.com/track/5JLrVTFMGGeeB5Iz4Oci0R"
    },
    "href": "https://api.spotify.com/v1/tracks/5JLrVTFMGGeeB5Iz4Oci0R",
    "id": "5JLrVTFMGGeeB5Iz4Oci0R",
    "is_local": false,
    "name": "Lust For Life - The Prodigy Remix",
    "popularity": 43,
    "preview_url": "https://p.scdn.co/mp3-preview/7b316e08f5ee46dbce6cee8857617e4f3420fe6c?cid=43d08932fdc34de185bd5f283082805d",
    "track_number": 1,
    "type": "track",
    "uri": "spotify:track:5JLrVTFMGGeeB5Iz4Oci0R"
  },
  {
    "album": {
      "album_type": "ALBUM",
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/4k1ELeJKT1ISyDv8JivPpB"
          },
          "href": "https://api.spotify.com/v1/artists/4k1ELeJKT1ISyDv8JivPpB",
          "id": "4k1ELeJKT1ISyDv8JivPpB",
          "name": "The Prodigy",
          "type": "artist",
          "uri": "spotify:artist:4k1ELeJKT1ISyDv8JivPpB"
        }
      ],

      "external_urls": {
        "spotify": "https://open.spotify.com/album/6DAq2tDWMqPP7MTdb3aIDi"
      },
      "href": "https://api.spotify.com/v1/albums/6DAq2tDWMqPP7MTdb3aIDi",
      "id": "6DAq2tDWMqPP7MTdb3aIDi",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/ab67616d0000b2737c13addc6b19119c18fff960",
          "width": 640
        },
        {
          "height": 300,
          "url": "https://i.scdn.co/image/ab67616d00001e027c13addc6b19119c18fff960",
          "width": 300
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/ab67616d000048517c13addc6b19119c18fff960",
          "width": 64
        }
      ],
      "name": "No Tourists",
      "release_date": "2018-11-02",
      "release_date_precision": "day",
      "total_tracks": 10,
      "type": "album",
      "uri": "spotify:album:6DAq2tDWMqPP7MTdb3aIDi"
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/4k1ELeJKT1ISyDv8JivPpB"
        },
        "href": "https://api.spotify.com/v1/artists/4k1ELeJKT1ISyDv8JivPpB",
        "id": "4k1ELeJKT1ISyDv8JivPpB",
        "name": "The Prodigy",
        "type": "artist",
        "uri": "spotify:artist:4k1ELeJKT1ISyDv8JivPpB"
      }
    ],

    "disc_number": 1,
    "duration_ms": 204914,
    "explicit": false,
    "external_ids": {
      "isrc": "GB5KW1802035"
    },
    "external_urls": {
      "spotify": "https://open.spotify.com/track/2sifRHahNmhTR7a3BjKc9u"
    },
    "href": "https://api.spotify.com/v1/tracks/2sifRHahNmhTR7a3BjKc9u",
    "id": "2sifRHahNmhTR7a3BjKc9u",
    "is_local": false,
    "name": "Timebomb Zone",
    "popularity": 51,
    "preview_url": "https://p.scdn.co/mp3-preview/6ad15abcbbcc5d8d37371088a4779e4e0e51a0df?cid=43d08932fdc34de185bd5f283082805d",
    "track_number": 6,
    "type": "track",
    "uri": "spotify:track:2sifRHahNmhTR7a3BjKc9u"
  },
  {
    "album": {
      "album_group": "ALBUM",
      "album_type": "ALBUM",
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/0AV5z1x1RoOGeJWeJzziDz"
          },
          "href": "https://api.spotify.com/v1/artists/0AV5z1x1RoOGeJWeJzziDz",
          "id": "0AV5z1x1RoOGeJWeJzziDz",
          "name": "Jordy Searcy",
          "type": "artist",
          "uri": "spotify:artist:0AV5z1x1RoOGeJWeJzziDz"
        }
      ],

      "external_urls": {
        "spotify": "https://open.spotify.com/album/7ls3OeXqL0DtUSxVVfqLdQ"
      },
      "href": "https://api.spotify.com/v1/albums/7ls3OeXqL0DtUSxVVfqLdQ",
      "id": "7ls3OeXqL0DtUSxVVfqLdQ",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/ab67616d0000b273cecb3e9708527022793b6936",
          "width": 640
        },
        {
          "height": 300,
          "url": "https://i.scdn.co/image/ab67616d00001e02cecb3e9708527022793b6936",
          "width": 300
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/ab67616d00004851cecb3e9708527022793b6936",
          "width": 64
        }
      ],
      "name": "Dark in the City",
      "release_date": "2018-02-15",
      "release_date_precision": "day",
      "total_tracks": 7,
      "type": "album",
      "uri": "spotify:album:7ls3OeXqL0DtUSxVVfqLdQ"
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/0AV5z1x1RoOGeJWeJzziDz"
        },
        "href": "https://api.spotify.com/v1/artists/0AV5z1x1RoOGeJWeJzziDz",
        "id": "0AV5z1x1RoOGeJWeJzziDz",
        "name": "Jordy Searcy",
        "type": "artist",
        "uri": "spotify:artist:0AV5z1x1RoOGeJWeJzziDz"
      }
    ],

    "disc_number": 1,
    "duration_ms": 250547,
    "explicit": false,
    "external_ids": {
      "isrc": "TCADM1850836"
    },
    "external_urls": {
      "spotify": "https://open.spotify.com/track/3m9al81IVXLFCF4vG8Nqjw"
    },
    "href": "https://api.spotify.com/v1/tracks/3m9al81IVXLFCF4vG8Nqjw",
    "id": "3m9al81IVXLFCF4vG8Nqjw",
    "is_local": false,
    "name": "Love & War in Your Twenties",
    "popularity": 68,
    "preview_url": "https://p.scdn.co/mp3-preview/499c001e10d23aed18259081b6bf6995518bbb39?cid=43d08932fdc34de185bd5f283082805d",
    "track_number": 1,
    "type": "track",
    "uri": "spotify:track:3m9al81IVXLFCF4vG8Nqjw"
  }
]
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    data: [{
      creator: 'Dario',
      playlist: 'Scopri Novità',
      tags: [{
        name:'bella',
        spotifyId: '12345',
        id:'asfd1234'
      },
        {
          name: 'figata',
          spotifyId: '12345',
          id: 'asfd1234'
        }],
      track: ExampleTracks[0] as Track
    },
      {
        creator: 'Dario',
        playlist: 'Scopri Novità',
        tags: [{
          name: 'bella',
          spotifyId: '12345',
          id: 'asfd1234'
        },
          {
            name: 'figata',
            spotifyId: '12345',
            id: 'asfd1234'
          }],
        track: ExampleTracks[1] as Track
      },
      {
        creator: 'Dario',
        playlist: 'Scopri Novità',
        tags: [{
          name: 'bella',
          spotifyId: '12345',
          id: 'asfd1234'
        },
          {
            name: 'figata',
            spotifyId: '12345',
            id: 'asfd1234'
          }],
        track: ExampleTracks[2] as Track
      },
    ],
    headers: ['Title', 'Playlist', 'Creator', 'Tags']
  },
};