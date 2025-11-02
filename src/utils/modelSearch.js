// Model Search Service - Search across multiple 3D model repositories

const SEARCH_APIS = {
  thingiverse: 'https://api.thingiverse.com/search',
  printables: 'https://api.printables.com/v1/search',
  // Add more as APIs become available
};

/**
 * Search for models across multiple platforms
 * @param {string} query - Search query from voice/text input
 * @param {object} options - Search options (platforms, limit, etc.)
 * @returns {Promise<Array>} Array of model results
 */
export async function searchModels(query, options = {}) {
  const {
    platforms = ['thingiverse', 'printables', 'makerworld', 'creality', 'grabcad', 'studiotripo'],
    limit = 10,
    apiKeys = {}
  } = options;

  console.log(`Searching for: ${query} across platforms:`, platforms);

  try {
    // Search all platforms in parallel
    const searchPromises = platforms.map(platform => 
      searchPlatform(platform, query, apiKeys[platform])
    );

    const results = await Promise.allSettled(searchPromises);
    
    // Combine and filter results
    const allModels = results
      .filter(r => r.status === 'fulfilled' && r.value)
      .flatMap(r => r.value)
      .slice(0, limit);

    console.log(`Found ${allModels.length} models`);
    return allModels;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search models. Please try again.');
  }
}

/**
 * Search a specific platform
 */
async function searchPlatform(platform, query, apiKey) {
  try {
    switch (platform) {
      case 'thingiverse':
        return await searchThingiverse(query, apiKey);
      case 'printables':
        return await searchPrintables(query, apiKey);
      case 'makerworld':
        return await searchMakerWorld(query);
      case 'creality':
        return await searchCreality(query);
      case 'grabcad':
        return await searchGrabCAD(query);
      case 'studiotripo':
        return await searchStudioTripo(query);
      default:
        console.warn(`Platform ${platform} not supported yet`);
        return [];
    }
  } catch (error) {
    console.error(`Error searching ${platform}:`, error);
    return [];
  }
}

/**
 * Thingiverse API Search
 */
async function searchThingiverse(query, apiKey) {
  if (!apiKey) {
    console.warn('Thingiverse API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.thingiverse.com/search/${encodeURIComponent(query)}?access_token=${apiKey}`
    );

    if (!response.ok) throw new Error('Thingiverse search failed');

    const data = await response.json();
    
    return (data.hits || []).map(hit => ({
      id: hit.id,
      name: hit.name,
      description: hit.description || '',
      thumbnail: hit.thumbnail,
      downloadUrl: hit.public_url,
      source: 'Thingiverse',
      creator: hit.creator?.name || 'Unknown',
      fileUrl: hit.files_url
    }));
  } catch (error) {
    console.error('Thingiverse error:', error);
    return [];
  }
}

/**
 * Printables API Search
 */
async function searchPrintables(query, apiKey) {
  try {
    // Printables has a public search API
    const response = await fetch(
      `https://www.printables.com/api/v1/search?q=${encodeURIComponent(query)}&limit=10`
    );

    if (!response.ok) throw new Error('Printables search failed');

    const data = await response.json();
    
    return (data.items || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.summary || '',
      thumbnail: item.image?.url || item.thumbnail_url,
      downloadUrl: `https://www.printables.com/model/${item.id}`,
      source: 'Printables',
      creator: item.user?.name || 'Unknown',
      fileUrl: item.download_url
    }));
  } catch (error) {
    console.error('Printables error:', error);
    return [];
  }
}

/**
 * MakerWorld Search (via web scraping fallback)
 */
async function searchMakerWorld(query) {
  try {
    // MakerWorld search - simplified approach
    const searchUrl = `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(query)}`;
    
    // For now, return mock data structure
    // In production, you'd implement proper scraping or wait for API access
    console.log('MakerWorld search would query:', searchUrl);
    
    return [];
  } catch (error) {
    console.error('MakerWorld error:', error);
    return [];
  }
}

/**
 * Creality Cloud Search
 */
async function searchCreality(query) {
  try {
    // Creality Cloud search - simplified approach
    const searchUrl = `https://www.crealitycloud.com/model-search?keyword=${encodeURIComponent(query)}`;
    
    console.log('Creality search would query:', searchUrl);
    
    return [];
  } catch (error) {
    console.error('Creality error:', error);
    return [];
  }
}

/**
 * GrabCAD Search
 */
async function searchGrabCAD(query) {
  try {
    // GrabCAD has a library API
    const response = await fetch(
      `https://grabcad.com/library?query=${encodeURIComponent(query)}&page=1&time=all_time&sort=recent&file_types=stl`
    );

    if (!response.ok) throw new Error('GrabCAD search failed');

    // Parse response - would need proper implementation
    console.log('GrabCAD search initiated');
    
    return [];
  } catch (error) {
    console.error('GrabCAD error:', error);
    return [];
  }
}

/**
 * StudioTripo Search
 */
async function searchStudioTripo(query) {
  try {
    console.log('StudioTripo search would query:', query);
    
    return [];
  } catch (error) {
    console.error('StudioTripo error:', error);
    return [];
  }
}

/**
 * Download and prepare model for import
 */
export async function downloadModel(model) {
  try {
    console.log(`Downloading model: ${model.name} from ${model.source}`);

    // For now, return model info for manual download
    // In production, implement actual download based on platform
    return {
      name: model.name,
      description: `${model.description}\n\nFrom: ${model.source}\nBy: ${model.creator}`,
      thumbnail: '🔍',
      source: model.source,
      downloadUrl: model.downloadUrl,
      isSearchResult: true
    };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(`Failed to download ${model.name}`);
  }
}

/**
 * Save API keys for model search platforms
 */
export function saveSearchAPIKeys(keys) {
  try {
    localStorage.setItem('modelSearchAPIKeys', JSON.stringify(keys));
  } catch (error) {
    console.error('Error saving API keys:', error);
  }
}

/**
 * Get saved API keys
 */
export function getSearchAPIKeys() {
  try {
    const keys = localStorage.getItem('modelSearchAPIKeys');
    return keys ? JSON.parse(keys) : {};
  } catch (error) {
    console.error('Error loading API keys:', error);
    return {};
  }
}
