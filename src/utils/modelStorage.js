import { supabase } from './supabaseClient';

/**
 * Upload STL file to Supabase Storage
 */
export const uploadModelFile = async (file, userId) => {
  try {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('stl-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('stl-files')
      .getPublicUrl(fileName);

    return {
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Save model metadata to database
 */
export const saveImportedModel = async (modelData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('imported_models')
      .insert([{
        user_id: user.id,
        name: modelData.name,
        description: modelData.description,
        file_url: modelData.file_url,
        file_size: modelData.file_size,
        thumbnail: modelData.thumbnail || '📁'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving model:', error);
    throw error;
  }
};

/**
 * Get all imported models for current user
 */
export const getImportedModels = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('imported_models')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

/**
 * Delete imported model
 */
export const deleteImportedModel = async (modelId, filePath) => {
  try {
    // Delete from database
    const { error: dbError } = await supabase
      .from('imported_models')
      .delete()
      .eq('id', modelId);

    if (dbError) throw dbError;

    // Delete file from storage if it exists
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('stl-files')
        .remove([filePath]);
      
      if (storageError) console.error('Error deleting file:', storageError);
    }

    return true;
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
};

/**
 * Check if user is premium
 */
export const isPremiumUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data?.subscription_tier === 'premium';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

/**
 * Get current user profile
 */
export const getUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
