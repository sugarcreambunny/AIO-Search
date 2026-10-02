import { MediaAsset, MediaFormat } from '../../types/media';
import { generateWaveformSamples } from './freesound';

export const DEMO_ASSETS: MediaAsset[] = [
  // --- PHOTOS (Pexels & Pixabay) ---
  {
    id: 'demo-photo-1',
    title: 'Neon Cyberpunk Alleyway at Midnight',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=95',
    author: 'Alexander Schimmeck',
    authorUrl: 'https://unsplash.com/@alexandre_schimmeck',
    source: 'pexels',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Free for commercial use',
    originalUrl: 'https://pexels.com',
    tags: ['cyberpunk', 'neon', 'cityscape', 'urban', 'night', 'city'],
    formats: [
      { label: 'Original 4K (2400x1600)', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=95' },
      { label: 'Full HD (1920x1080)', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85' },
    ]
  },
  {
    id: 'demo-photo-2',
    title: 'Minimalist Architecture with Dramatic Shadows',
    previewUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=95',
    author: 'Simone Hutsch',
    authorUrl: 'https://pixabay.com',
    source: 'pixabay',
    mediaType: 'photo',
    width: 1400,
    height: 1900,
    aspectRatio: 'portrait',
    license: 'Pixabay License (Free for commercial use)',
    originalUrl: 'https://pixabay.com',
    tags: ['architecture', 'minimal', 'interior', 'geometry', 'building', 'design'],
    formats: [
      { label: 'High-Res Portrait', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=95' }
    ]
  },
  {
    id: 'demo-photo-3',
    title: 'Emerald Forest Mist at Sunrise',
    previewUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=95',
    author: 'Sebastian Unrau',
    authorUrl: 'https://pexels.com',
    source: 'pexels',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Pexels License (Free to use)',
    originalUrl: 'https://pexels.com',
    tags: ['forest', 'nature', 'fog', 'morning', 'trees', 'green', 'landscape'],
    formats: [
      { label: 'Original 4K', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=95' }
    ]
  },
  {
    id: 'demo-photo-4',
    title: 'Futuristic Studio Workspace Setup',
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2200&q=95',
    author: 'Lorenzo Herrera',
    authorUrl: 'https://pixabay.com',
    source: 'pixabay',
    mediaType: 'photo',
    width: 2200,
    height: 1467,
    aspectRatio: 'landscape',
    license: 'Free for commercial use',
    originalUrl: 'https://pixabay.com',
    tags: ['retro', 'workspace', 'gaming', 'tech', 'computer', 'setup', 'desk'],
    formats: [
      { label: 'Full Resolution', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2200&q=95' }
    ]
  },
  {
    id: 'demo-photo-5',
    title: 'Abstract 3D Liquid Chrome Prism',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=95',
    author: 'Milad Fakurian',
    authorUrl: 'https://pexels.com',
    source: 'pexels',
    mediaType: 'photo',
    width: 2000,
    height: 2000,
    aspectRatio: 'square',
    license: 'Pexels License',
    originalUrl: 'https://pexels.com',
    tags: ['abstract', '3d', 'gradient', 'modern', 'art', 'color', 'creative'],
    formats: [
      { label: 'Square 2K (2000x2000)', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=95' }
    ]
  },
  {
    id: 'demo-photo-6',
    title: 'Golden Sunset over Dramatic Mountain Peaks',
    previewUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=95',
    author: 'Kaley Dykstra',
    authorUrl: 'https://pixabay.com',
    source: 'pixabay',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Pixabay License',
    originalUrl: 'https://pixabay.com',
    tags: ['mountains', 'sunset', 'nature', 'travel', 'sky', 'clouds', 'gold'],
    formats: [
      { label: 'Original 4K', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=95' }
    ]
  },
  {
    id: 'demo-photo-7',
    title: 'Vintage Sports Car on Scenic Coastal Highway',
    previewUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=95',
    author: 'Campbell',
    authorUrl: 'https://pexels.com',
    source: 'pexels',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Pexels License',
    originalUrl: 'https://pexels.com',
    tags: ['car', 'vehicle', 'drive', 'speed', 'automobile', 'highway', 'travel'],
    formats: [
      { label: 'Original 4K', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=95' }
    ]
  },
  {
    id: 'demo-photo-8',
    title: 'Artisan Coffee Pouring in Moody Cafe',
    previewUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=2000&q=95',
    author: 'Nathan Dumlao',
    authorUrl: 'https://pixabay.com',
    source: 'pixabay',
    mediaType: 'photo',
    width: 1400,
    height: 1900,
    aspectRatio: 'portrait',
    license: 'Pixabay License',
    originalUrl: 'https://pixabay.com',
    tags: ['coffee', 'cafe', 'drink', 'food', 'morning', 'lifestyle', 'barista'],
    formats: [
      { label: 'Full HD Portrait', url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=2000&q=95' }
    ]
  },

  // --- VIDEOS (Pexels & Pixabay) ---
  {
    id: 'demo-video-1',
    title: 'Cinematic Ocean Waves Slow Motion',
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    author: 'Tom Fisk',
    authorUrl: 'https://pexels.com',
    source: 'pexels',
    mediaType: 'video',
    width: 1920,
    height: 1080,
    duration: 14.2,
    aspectRatio: 'landscape',
    license: 'Free to use (Pexels License)',
    originalUrl: 'https://pexels.com',
    tags: ['waves', 'ocean', 'beach', 'cinematic', 'sea', 'water', 'nature'],
    formats: [
      { label: '1080p HD (1920x1080)', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4', width: 1920, height: 1080 }
    ]
  },
  {
    id: 'demo-video-2',
    title: 'Cyberpunk Drone Flight Through Night Metropolis',
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42861-large.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42861-large.mp4',
    author: 'Marc Freccero',
    authorUrl: 'https://pixabay.com',
    source: 'pixabay',
    mediaType: 'video',
    width: 1920,
    height: 1080,
    duration: 21.0,
    aspectRatio: 'landscape',
    license: 'Free for commercial use',
    originalUrl: 'https://pixabay.com',
    tags: ['city', 'traffic', 'lights', 'night', 'urban', 'cyberpunk', 'drone', 'cars'],
    formats: [
      { label: '1080p Full HD', url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42861-large.mp4', width: 1920, height: 1080 }
    ]
  },
  {
    id: 'demo-video-3',
    title: 'Portrait Mode: Model Walking in Sunlit Golden Hour',
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-smiling-at-the-camera-42866-large.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-smiling-at-the-camera-42866-large.mp4',
    author: 'Anna Shvets',
    authorUrl: 'https://pexels.com',
    source: 'pexels',
    mediaType: 'video',
    width: 1080,
    height: 1920,
    duration: 9.5,
    aspectRatio: 'portrait',
    license: 'Free to use (Pexels License)',
    originalUrl: 'https://pexels.com',
    tags: ['portrait', 'reels', 'shorts', 'goldenhour', 'person', 'woman', 'smile', 'model'],
    formats: [
      { label: '9:16 Vertical HD (1080x1920)', url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-smiling-at-the-camera-42866-large.mp4', width: 1080, height: 1920 }
    ]
  },
  {
    id: 'demo-video-4',
    title: 'Time Lapse of Stars and Milky Way Galaxy',
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    author: 'Astrophoto Pro',
    authorUrl: 'https://pixabay.com',
    source: 'pixabay',
    mediaType: 'video',
    width: 1920,
    height: 1080,
    duration: 16.0,
    aspectRatio: 'landscape',
    license: 'Pixabay License',
    originalUrl: 'https://pixabay.com',
    tags: ['space', 'galaxy', 'stars', 'night', 'astronomy', 'cosmos', 'sky'],
    formats: [
      { label: 'Full HD Space Video', url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4', width: 1920, height: 1080 }
    ]
  },

  // --- AUDIO / SFX (Freesound) ---
  {
    id: 'demo-audio-1',
    title: 'Cinematic Deep Impact Braam Whoosh',
    previewUrl: 'https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg',
    downloadUrl: 'https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg',
    author: 'SoundFX_Master',
    authorUrl: 'https://freesound.org',
    source: 'freesound',
    mediaType: 'audio',
    duration: 4.8,
    license: 'CC0 1.0 Universal',
    originalUrl: 'https://freesound.org',
    tags: ['cinematic', 'whoosh', 'impact', 'trailer', 'sound fx', 'braam', 'bass', 'action'],
    formats: [
      { label: 'Master Stereo OGG', url: 'https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg' }
    ],
    waveform: generateWaveformSamples(4.8, 'impact_whoosh')
  },
  {
    id: 'demo-audio-2',
    title: 'Mechanical Camera Shutter Snap',
    previewUrl: 'https://actions.google.com/sounds/v1/household/clock_ticking.ogg',
    downloadUrl: 'https://actions.google.com/sounds/v1/household/clock_ticking.ogg',
    author: 'AudioArchitect',
    authorUrl: 'https://freesound.org',
    source: 'freesound',
    mediaType: 'audio',
    duration: 3.2,
    license: 'CC-BY 3.0',
    originalUrl: 'https://freesound.org',
    tags: ['camera', 'foley', 'click', 'shutter', 'photo', 'snap', 'tick', 'sound fx'],
    formats: [
      { label: 'HQ Audio OGG', url: 'https://actions.google.com/sounds/v1/household/clock_ticking.ogg' }
    ],
    waveform: generateWaveformSamples(3.2, 'camera_shutter')
  },
  {
    id: 'demo-audio-3',
    title: 'Ambient Gentle Rain on Forest Canopy',
    previewUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
    downloadUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
    author: 'NatureSoundscapes',
    authorUrl: 'https://freesound.org',
    source: 'freesound',
    mediaType: 'audio',
    duration: 18.5,
    license: 'CC-BY 4.0',
    originalUrl: 'https://freesound.org',
    tags: ['rain', 'ambience', 'nature', 'relaxing', 'water', 'weather', 'storm', 'sound fx'],
    formats: [
      { label: 'HQ Ambience Track', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg' }
    ],
    waveform: generateWaveformSamples(18.5, 'rain_forest')
  },
  {
    id: 'demo-audio-4',
    title: 'Sci-Fi Holographic Interface Beep',
    previewUrl: 'https://actions.google.com/sounds/v1/science_fiction/scifi_teleport.ogg',
    downloadUrl: 'https://actions.google.com/sounds/v1/science_fiction/scifi_teleport.ogg',
    author: 'PulseAudio',
    authorUrl: 'https://freesound.org',
    source: 'freesound',
    mediaType: 'audio',
    duration: 5.4,
    license: 'CC0 1.0 Universal',
    originalUrl: 'https://freesound.org',
    tags: ['ui', 'scifi', 'hud', 'tech', 'beep', 'teleport', 'interface', 'sound fx'],
    formats: [
      { label: 'HQ UI SFX', url: 'https://actions.google.com/sounds/v1/science_fiction/scifi_teleport.ogg' }
    ],
    waveform: generateWaveformSamples(5.4, 'scifi_ui')
  },

  // --- GIFS & STICKERS (GIPHY) ---
  {
    id: 'demo-gif-1',
    title: 'Mind Blown Cosmic Explosion Reaction',
    previewUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    author: 'CosmicStudio',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com/gifs/space-stars-26ufdipQqU2lhNA4g',
    tags: ['mind blown', 'reaction', 'space', 'galaxy', 'boom', 'wow', 'universe'],
    formats: [
      { label: 'Original GIF (480x270)', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-2',
    title: 'Typing Super Fast Hacker Neon Keyboard',
    previewUrl: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
    author: 'CodeVibes',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['coding', 'hacker', 'typing', 'developer', 'computer', 'tech', 'code'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-3',
    title: 'Victory Dance High Energy Loop',
    previewUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    author: 'CartoonMania',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 480,
    aspectRatio: 'square',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['dance', 'celebration', 'win', 'party', 'happy', 'fun', 'victory'],
    formats: [
      { label: 'Original Square GIF', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-4',
    title: 'Electric Loading Neon Spinner Loop',
    previewUrl: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    author: 'MotionGraphics',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['loading', 'spinner', 'loop', 'neon', 'wait', 'buffer', 'circle'],
    formats: [
      { label: 'Animated GIF', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-cat-1',
    title: 'Cat Vibing Bop Groovy Head Dance',
    previewUrl: 'https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif',
    author: 'VibeCatStudios',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 480,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['cat', 'cats', 'kitten', 'vibe', 'dancing', 'dance', 'groove', 'cute', 'music', 'bop', 'funny', 'pet', 'animal'],
    formats: [
      { label: 'Original Square GIF', url: 'https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-cat-2',
    title: 'Cat Typing Fast at Computer Workload',
    previewUrl: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    author: 'OfficeCats',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['cat', 'cats', 'typing', 'work', 'computer', 'funny', 'busy', 'office', 'coding', 'pet'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-dog-1',
    title: 'Excited Dog Smiling With Happy Ears',
    previewUrl: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif',
    author: 'GoodBoyClub',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 480,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['dog', 'dogs', 'puppy', 'happy', 'excited', 'smile', 'cute', 'pet', 'animal', 'joy'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-hello-1',
    title: 'Friendly Hand Wave Greeting Hello',
    previewUrl: 'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif',
    author: 'WaveCreator',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hi', 'wave', 'waving', 'hand', 'greeting', 'welcome', 'friendly', 'hey'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-hello-2',
    title: 'Cute Dog Saying Hello Friendly Wave',
    previewUrl: 'https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif',
    author: 'PuppyGreetings',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hi', 'dog', 'puppy', 'wave', 'greeting', 'welcome', 'cute', 'pet', 'hey'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-hello-3',
    title: 'General Kenobi Hello There Reaction',
    previewUrl: 'https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif',
    author: 'StarWarsMemes',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hello there', 'kenobi', 'greeting', 'obi wan', 'reaction', 'welcome', 'hi'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-dog-2',
    title: 'Puppy Confused Head Tilt Reaction',
    previewUrl: 'https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif',
    author: 'PupReactions',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['dog', 'dogs', 'puppy', 'confused', 'head tilt', 'what', 'reaction', 'question', 'curious', 'cute'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-laugh-1',
    title: 'Laughing Out Loud Cannot Stop Laughing',
    previewUrl: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif',
    author: 'ComedyCentral',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['laugh', 'laughing', 'lol', 'haha', 'funny', 'hilarious', 'joke', 'crying laugh', 'reaction', 'humor'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-yes-1',
    title: 'Nodding Yes Absolutely Agree Reaction',
    previewUrl: 'https://media.giphy.com/media/10Jpr9KSaXLchW/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/10Jpr9KSaXLchW/giphy.gif',
    author: 'MovieMoments',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['yes', 'nod', 'agree', 'approval', 'correct', 'definitely', 'jack nicholson', 'reaction', 'nodding'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/10Jpr9KSaXLchW/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-no-1',
    title: 'No God Please No Disagreement',
    previewUrl: 'https://media.giphy.com/media/vyTnNTrs3wqQ0UIvwE/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/vyTnNTrs3wqQ0UIvwE/giphy.gif',
    author: 'TheOfficeMemes',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['no', 'disagree', 'stop', 'nope', 'refuse', 'office', 'steve carell', 'reaction', 'crying', 'shock'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/vyTnNTrs3wqQ0UIvwE/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-cheers-1',
    title: 'Great Gatsby Toast Cheers Celebration',
    previewUrl: 'https://media.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif',
    author: 'CinemaLovers',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['cheers', 'toast', 'celebration', 'drink', 'party', 'congrats', 'success', 'gatsby', 'leonardo', 'champagne', 'celebrate'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-love-1',
    title: 'Heart Eyes In Love Heartbeat Reaction',
    previewUrl: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    author: 'CuteExpressions',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['love', 'heart', 'heart eyes', 'romantic', 'crush', 'cute', 'sweet', 'reaction', 'affection'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-confused-1',
    title: 'John Travolta Looking Around Confused Reaction',
    previewUrl: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif',
    author: 'RetroPulp',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 270,
    aspectRatio: 'landscape',
    rating: 'PG',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['confused', 'travolta', 'lost', 'where', 'what', 'searching', 'empty', 'reaction', 'pulp fiction'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-popcorn-1',
    title: 'Eating Popcorn Watching The Drama',
    previewUrl: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif',
    author: 'PopcornGang',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['popcorn', 'eating', 'drama', 'watching', 'cinema', 'entertained', 'waiting', 'snack', 'reaction', 'food'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif' }
    ]
  },
  {
    id: 'demo-gif-clap-1',
    title: 'Enthusiastic Clapping Applause Bravo',
    previewUrl: 'https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif',
    author: 'BravoStudio',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'gif',
    width: 480,
    height: 360,
    aspectRatio: 'landscape',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['clap', 'clapping', 'applause', 'bravo', 'congrats', 'well done', 'proud', 'respect', 'reaction', 'cheering'],
    formats: [
      { label: 'Original GIF', url: 'https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif' }
    ]
  },

  // --- ANIMATED STICKERS (GIPHY Stickers) ---
  {
    id: 'demo-sticker-1',
    title: 'Blazing Fire Flame Animated Sticker',
    previewUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
    author: 'StickerBomb',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'fire', 'flame', 'hot', 'lit', 'animation', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-2',
    title: 'Sparkling Golden Star Badge Sticker',
    previewUrl: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif',
    author: 'SparklePop',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'star', 'sparkle', 'gold', 'badge', 'glitter', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-3',
    title: 'Neon Hologram Heart Pulse Sticker',
    previewUrl: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif',
    author: 'NeonPulse',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'heart', 'love', 'pulse', 'neon', 'pink', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-4',
    title: 'Electric WOW Reaction Stamp Sticker',
    previewUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    author: 'RetroStamp',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'wow', 'reaction', 'stamp', 'retro', 'comic', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-5',
    title: 'Thumbs Up Green Glow Approved Sticker',
    previewUrl: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif',
    author: 'GlowArt',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'thumbs up', 'approved', 'yes', 'good', 'green', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-6',
    title: 'Subscribe & Bell Notification Alert Sticker',
    previewUrl: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    author: 'YouTubeCreators',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'subscribe', 'bell', 'alert', 'youtube', 'creator', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-7',
    title: 'Rainbow Sparkles Kawaii Cloud Sticker',
    previewUrl: 'https://media.giphy.com/media/mGcNjsfWAjY5AEZNw6/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/mGcNjsfWAjY5AEZNw6/giphy.gif',
    author: 'KawaiiClub',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'rainbow', 'cloud', 'sparkle', 'cute', 'kawaii', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/mGcNjsfWAjY5AEZNw6/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-8',
    title: 'Party Confetti Popper Celebration Sticker',
    previewUrl: 'https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif',
    author: 'PartyTime',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['sticker', 'party', 'confetti', 'celebration', 'popper', 'yay', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-hello-1',
    title: 'Vibrant Neon Glowing HELLO Animated Sticker',
    previewUrl: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
    author: 'NeonSigns',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hi', 'hey', 'sticker', 'neon', 'greeting', 'text', 'glow', 'transparent', 'welcome'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-hello-2',
    title: 'Colorful Rainbow HELLO Animated Typography Sticker',
    previewUrl: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    author: 'TypeStudio',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hi', 'hey', 'sticker', 'rainbow', 'colorful', 'greeting', 'wave', 'transparent', 'welcome'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-hello-3',
    title: 'Hand Waving Hello & Goodbye Transparent Sticker',
    previewUrl: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif',
    author: 'HandDrawn',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hi', 'wave', 'waving', 'hand', 'bye', 'goodbye', 'sticker', 'greeting', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-hello-4',
    title: 'Animated Lettering HELLO Celebration Sticker',
    previewUrl: 'https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif',
    author: 'LetteringCo',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['hello', 'hi', 'greeting', 'celebration', 'sticker', 'text', 'fun', 'transparent', 'welcome'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-cat-1',
    title: 'Cute White Kitty Winking Sticker',
    previewUrl: 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
    author: 'KittyAnimation',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['cat', 'cats', 'kitten', 'sticker', 'paw', 'wink', 'cute', 'transparent', 'pet', 'animal'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-dog-1',
    title: 'Happy Puppy Wagging Tail Sticker',
    previewUrl: 'https://media.giphy.com/media/xUPGcC4A6ElcqtUJck/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/xUPGcC4A6ElcqtUJck/giphy.gif',
    author: 'DogLoversStudio',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['dog', 'dogs', 'puppy', 'sticker', 'tail', 'happy', 'cute', 'transparent', 'pet', 'animal'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/xUPGcC4A6ElcqtUJck/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-cool-1',
    title: 'Pixel Sunglasses Thug Life Cool Sticker',
    previewUrl: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
    author: 'PixelArt',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['cool', 'sunglasses', 'swag', 'sticker', 'retro', 'pixel', 'transparent', 'glasses'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-omg-1',
    title: 'Neon OMG Electric Reaction Sticker',
    previewUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    author: 'NeonPop',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['omg', 'reaction', 'neon', 'sticker', 'electric', 'surprise', 'wow', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-100-1',
    title: '100 Percent Keep It Real Red Stamp Sticker',
    previewUrl: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
    author: 'StreetBadge',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['100', 'percent', 'stamp', 'sticker', 'real', 'score', 'perfect', 'transparent'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif' }
    ]
  },
  {
    id: 'demo-sticker-heart-1',
    title: 'Floating Pink Glowing Hearts Sticker',
    previewUrl: 'https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif',
    downloadUrl: 'https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif',
    author: 'LoveCraft',
    authorUrl: 'https://giphy.com',
    source: 'giphy',
    mediaType: 'sticker',
    width: 400,
    height: 400,
    aspectRatio: 'square',
    rating: 'G',
    license: 'GIPHY Standard Terms',
    originalUrl: 'https://giphy.com',
    tags: ['heart', 'love', 'pink', 'sticker', 'glow', 'floating', 'cute', 'transparent', 'valentine'],
    formats: [
      { label: 'Transparent Sticker GIF', url: 'https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif' }
    ]
  },

  // --- ADDITIONAL CURATED ASSETS FOR POPULAR TOPICS ---
  {
    id: 'demo-photo-dog-1',
    title: 'Golden Retriever Puppy Playing in Green Park',
    previewUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=2400&q=95',
    author: 'Alvan Nee',
    authorUrl: 'https://unsplash.com',
    source: 'pexels',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Pexels Free License',
    tags: ['dog', 'dogs', 'puppy', 'golden retriever', 'pet', 'pets', 'animal', 'animals', 'park', 'grass'],
    formats: [
      { label: 'Original 4K (2400x1600)', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=2400&q=95', width: 2400, height: 1600 }
    ]
  },
  {
    id: 'demo-photo-cat-1',
    title: 'Curious Striped Ginger Cat Portrait',
    previewUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1600&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2400&q=95',
    author: 'Mikhail Vasilyev',
    authorUrl: 'https://unsplash.com',
    source: 'pixabay',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Pixabay Free Commercial License',
    tags: ['cat', 'cats', 'kitten', 'pet', 'pets', 'animal', 'feline', 'whiskers', 'eyes'],
    formats: [
      { label: 'Original 4K', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2400&q=95' }
    ]
  },
  {
    id: 'demo-video-dog-1',
    title: 'Playful Dog Running Across Sunny Lawn',
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dog-running-on-grass-in-a-park-42267-large.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dog-running-on-grass-in-a-park-42267-large.mp4',
    author: 'Mixkit Nature',
    authorUrl: 'https://mixkit.co',
    source: 'pexels',
    mediaType: 'video',
    width: 1920,
    height: 1080,
    duration: 8.4,
    aspectRatio: 'landscape',
    license: 'Mixkit Stock Video Free License',
    tags: ['dog', 'dogs', 'puppy', 'pet', 'running', 'animal', 'park', 'nature'],
    formats: [
      { label: '1080p MP4', url: 'https://assets.mixkit.co/videos/preview/mixkit-dog-running-on-grass-in-a-park-42267-large.mp4', width: 1920, height: 1080 }
    ]
  },
  {
    id: 'demo-photo-car-1',
    title: 'Modern High Performance Sports Car in City',
    previewUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=95',
    author: 'Campbell',
    authorUrl: 'https://unsplash.com',
    source: 'pexels',
    mediaType: 'photo',
    width: 2400,
    height: 1600,
    aspectRatio: 'landscape',
    license: 'Pexels Free License',
    tags: ['car', 'cars', 'vehicle', 'automotive', 'supercar', 'sports car', 'drive', 'speed', 'luxury'],
    formats: [
      { label: '4K Ultra', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=95' }
    ]
  },
  {
    id: 'demo-video-car-1',
    title: 'Night Traffic Flow Along Metropolitan Highway',
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-highway-at-night-4245-large.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-highway-at-night-4245-large.mp4',
    author: 'UrbanCinema',
    authorUrl: 'https://mixkit.co',
    source: 'pexels',
    mediaType: 'video',
    width: 1920,
    height: 1080,
    duration: 11.2,
    aspectRatio: 'landscape',
    license: 'Mixkit Free Video License',
    tags: ['car', 'cars', 'traffic', 'highway', 'night', 'lights', 'city', 'speed', 'transportation'],
    formats: [
      { label: 'Full HD 1080p', url: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-highway-at-night-4245-large.mp4' }
    ]
  },
  {
    id: 'demo-audio-dog-1',
    title: 'Happy Dog Barking Sound Effect',
    previewUrl: 'https://actions.google.com/sounds/v1/animals/dog_barking.ogg',
    downloadUrl: 'https://actions.google.com/sounds/v1/animals/dog_barking.ogg',
    author: 'AudioAnimalHQ',
    authorUrl: 'https://freesound.org',
    source: 'freesound',
    mediaType: 'audio',
    duration: 3.5,
    license: 'CC0 1.0 Universal',
    tags: ['dog', 'dogs', 'bark', 'barking', 'puppy', 'animal', 'pet', 'sound fx'],
    formats: [
      { label: 'Master Stereo OGG', url: 'https://actions.google.com/sounds/v1/animals/dog_barking.ogg' }
    ],
    waveform: generateWaveformSamples(3.5, 'dog_bark')
  },
  {
    id: 'demo-audio-car-1',
    title: 'Sports Car Engine Acceleration Drive By',
    previewUrl: 'https://actions.google.com/sounds/v1/transportation/car_passing_by.ogg',
    downloadUrl: 'https://actions.google.com/sounds/v1/transportation/car_passing_by.ogg',
    author: 'MotorSounds',
    authorUrl: 'https://freesound.org',
    source: 'freesound',
    mediaType: 'audio',
    duration: 4.8,
    license: 'CC-BY 3.0',
    tags: ['car', 'cars', 'engine', 'vehicle', 'drive', 'speed', 'passing', 'motor', 'sound fx'],
    formats: [
      { label: 'Master Stereo OGG', url: 'https://actions.google.com/sounds/v1/transportation/car_passing_by.ogg' }
    ],
    waveform: generateWaveformSamples(4.8, 'car_rev')
  }
];

/**
 * Calculates a strict relevance score for a given asset against a search query.
 * Returns 0 if the asset is irrelevant to the query.
 */
function getRelevanceScore(asset: MediaAsset, rawQuery: string): number {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return 1;

  const title = (asset.title || '').toLowerCase();
  const author = (asset.author || '').toLowerCase();
  const tags = (asset.tags || []).map((t) => t.toLowerCase());

  // 1. Exact full query matches
  if (title === query) return 100;
  if (tags.includes(query)) return 90;

  // 2. Full query substring in title or tags
  if (title.includes(query)) return 70;
  if (tags.some((t) => t.includes(query))) return 60;

  // 3. Word token matching with normalization/stemming
  const tokens = query.split(/\s+/).filter(Boolean);
  let score = 0;

  for (const token of tokens) {
    const rootToken = token.length > 3 ? token.replace(/(s|es|ing|ed)$/i, '') : token;

    const matchesTitle = title.includes(token) || (rootToken && title.includes(rootToken));
    const matchesTag = tags.some((t) => t.includes(token) || (rootToken && t.includes(rootToken)));
    const matchesAuthor = author.includes(token);

    if (matchesTitle) score += 30;
    if (matchesTag) score += 25;
    if (matchesAuthor) score += 10;
  }

  return score;
}

/**
 * High-precision search:
 * - When query is non-empty, ONLY genuinely matching assets are returned.
 * - Results are sorted strictly by relevance score.
 * - If no assets match the query, returns an empty array [] so the user sees a proper empty state.
 * - When query is empty, returns all curated items for the active tab.
 */
export function filterDemoAssets(
  query: string,
  tab: string,
  providers: Record<string, boolean>,
  aspectRatio: string,
  durationFilter: string
): MediaAsset[] {
  const hasAnyProviderEnabled = Object.values(providers).some(Boolean);
  const effectiveProviders = hasAnyProviderEnabled
    ? providers
    : { pexels: true, pixabay: true, giphy: true, freesound: true };

  const cleanQuery = query.trim();

  // 1. Filter by Provider and Tab
  const tabFiltered = DEMO_ASSETS.filter((asset) => {
    if (!effectiveProviders[asset.source]) return false;

    if (tab === 'photos' && asset.mediaType !== 'photo') return false;
    if (tab === 'videos' && asset.mediaType !== 'video') return false;
    if (tab === 'audio' && asset.mediaType !== 'audio') return false;
    if (tab === 'gifs' && asset.mediaType !== 'gif') return false;
    if (tab === 'stickers' && asset.mediaType !== 'sticker') return false;

    // Aspect ratio check
    if (aspectRatio !== 'all' && asset.aspectRatio && asset.aspectRatio !== aspectRatio) {
      return false;
    }

    // Audio duration check
    if (asset.mediaType === 'audio' && durationFilter !== 'all' && asset.duration) {
      if (durationFilter === 'short' && asset.duration > 5) return false;
      if (durationFilter === 'medium' && (asset.duration <= 5 || asset.duration > 30)) return false;
      if (durationFilter === 'long' && asset.duration <= 30) return false;
    }

    return true;
  });

  // If no search query, return all matching items for the current tab
  if (!cleanQuery) {
    return tabFiltered;
  }

  // 2. Strict relevance filtering and ranking
  const scoredMatches = tabFiltered
    .map((asset) => ({ asset, score: getRelevanceScore(asset, cleanQuery) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.asset);

  return scoredMatches;
}
