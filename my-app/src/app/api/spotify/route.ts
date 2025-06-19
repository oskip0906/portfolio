import { NextResponse } from 'next/server';
import { env } from 'process';

async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET),
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Spotify token');
    }

    const data = await response.json();
    return data.access_token;
}

async function fetchFromSpotify(url: string, token: string) {
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
}

export async function GET() {
    try {
        const token = await getSpotifyToken();
        
        // Get playlist info
        const playlistInfo = await fetchFromSpotify(
            `https://api.spotify.com/v1/playlists/${env.SPOTIFY_PLAYLIST_ID}?fields=tracks.total`,
            token
        );

        const totalTracks = playlistInfo.tracks.total;
        if (totalTracks === 0) {
            return NextResponse.json({ error: 'Playlist is empty' }, { status: 404 });
        }

        // Get random track
        const randomOffset = Math.floor(Math.random() * totalTracks);
        const trackData = await fetchFromSpotify(
            `https://api.spotify.com/v1/playlists/${env.SPOTIFY_PLAYLIST_ID}/tracks?offset=${randomOffset}&limit=1`,
            token
        );

        const track = trackData.items?.[0]?.track;
        if (!track?.id) {
            return NextResponse.json({ error: 'Track unavailable, try again' }, { status: 404 });
        }

        return NextResponse.json({
            id: track.id,
            name: track.name,
            artist: track.artists.map((artist: any) => artist.name).join(', '),
            album: track.album.name,
            embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
            popularity: track.popularity,
            releaseDate: track.album.release_date,
        });

    } catch (error) {
        console.error('Spotify API error:', error);
        return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
    }
}
